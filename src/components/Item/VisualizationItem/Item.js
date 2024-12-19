import {
    VIS_TYPE_OUTLIER_TABLE,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { Tag, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { acSetItemActiveType } from '../../../actions/itemActiveTypes.js'
import { acSetSlideshow } from '../../../actions/slideshow.js'
import { acAddVisualization } from '../../../actions/visualizations.js'
import { apiPostDataStatistics } from '../../../api/dataStatistics.js'
import { apiFetchVisualization } from '../../../api/fetchVisualization.js'
import {
    isEditMode,
    isPrintMode,
    isViewMode,
} from '../../../modules/dashboardModes.js'
import { getItemHeightPx } from '../../../modules/gridUtil.js'
import {
    getVisualizationId,
    getVisualizationName,
} from '../../../modules/item.js'
import {
    getDataStatisticsName,
    getItemTypeForVis,
    CHART,
    EVENT_VISUALIZATION,
    VISUALIZATION,
    EVENT_REPORT,
} from '../../../modules/itemTypes.js'
import { sGetIsEditing } from '../../../reducers/editDashboard.js'
import { sGetItemActiveType } from '../../../reducers/itemActiveTypes.js'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../reducers/itemFilters.js'
import { sGetSlideshow } from '../../../reducers/slideshow.js'
import { sGetVisualization } from '../../../reducers/visualizations.js'
import { SystemSettingsCtx } from '../../SystemSettingsProvider.js'
import { WindowDimensionsCtx } from '../../WindowDimensionsProvider.js'
import ItemHeader from '../ItemHeader/ItemHeader.js'
import FatalErrorBoundary from './FatalErrorBoundary.js'
import { getGridItemElement } from './getGridItemElement.js'
import ItemContextMenu from './ItemContextMenu/ItemContextMenu.js'
import ItemFooter from './ItemFooter.js'
import memoizeOne from './memoizeOne.js'
import styles from './styles/Item.module.css'
import { pluginIsAvailable } from './Visualization/plugin.js'
import Visualization from './Visualization/Visualization.js'

const MIN_CLIENT_HEIGHT = 16
const FS_CONTROLS_BUFFER = 40 // space for the fullscreen controls at bottom

class Item extends Component {
    state = {
        showFooter: false,
        configLoaded: false,
        loadItemFailed: false,
        showNoFiltersOverlay: this.props.item?.type === EVENT_VISUALIZATION,
    }

    constructor(props) {
        super(props)

        this.contentRef = React.createRef()
        this.headerRef = React.createRef()

        const style = window.getComputedStyle(document.documentElement)
        this.itemContentPadding = parseInt(
            style.getPropertyValue('--item-content-padding').replace('px', '')
        )

        this.itemHeaderTotalMargin =
            parseInt(
                style
                    .getPropertyValue('--item-header-margin-top')
                    .replace('px', '')
            ) +
            parseInt(
                style
                    .getPropertyValue('--item-header-margin-bottom')
                    .replace('px', '')
            )

        this.memoizedGetContentHeight = memoizeOne(
            (calculatedHeight, measuredHeight, preferMeasured) =>
                preferMeasured
                    ? measuredHeight || calculatedHeight
                    : calculatedHeight
        )
    }

    async componentDidMount() {
        // Avoid refetching the visualization already in the Redux store
        // when the same dashboard item is added again.
        // This also solves a flashing of all the "duplicated" dashboard items.
        !this.props.visualization.id &&
            this.props.setVisualization(
                await apiFetchVisualization(this.props.item)
            )

        try {
            if (
                this.props.settings
                    .keyGatherAnalyticalObjectStatisticsInDashboardViews &&
                isViewMode(this.props.dashboardMode)
            ) {
                await apiPostDataStatistics(
                    getDataStatisticsName(this.props.item.type),
                    getVisualizationId(this.props.item),
                    this.props.engine
                )
            }
        } catch (e) {
            console.log(e)
        }

        this.setState({ configLoaded: true })
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.isRecording &&
            this.props.isRecording !== prevProps.isRecording
        ) {
            apiFetchVisualization(this.props.item)
        }
    }

    isFullscreenSupported = () => {
        const el = getGridItemElement(this.props.item.id)
        return !!(el?.requestFullscreen || el?.webkitRequestFullscreen)
    }

    onClickNoFiltersOverlay = () =>
        this.setState({ showNoFiltersOverlay: false })

    onToggleFooter = () => {
        this.setState(
            { showFooter: !this.state.showFooter },
            this.props.onToggleItemExpanded(this.props.item.id)
        )
    }

    setActiveType = (type) => {
        type !== this.getActiveType() &&
            this.props.setActiveType(this.props.item.id, type)
    }

    getActiveType = () => {
        if (this.props.isEditing) {
            return getItemTypeForVis(this.props.item)
        }
        return this.props.activeType || getItemTypeForVis(this.props.item)
    }

    getAvailableHeight = ({ width }) => {
        if (this.props.isFullscreen) {
            const totalNonVisHeight =
                (this.headerRef.current.clientHeight || MIN_CLIENT_HEIGHT) +
                this.itemHeaderTotalMargin +
                (this.props.isFullscreen ? 0 : this.itemContentPadding) +
                FS_CONTROLS_BUFFER

            return `calc(100vh - ${totalNonVisHeight}px)`
        }
        const calculatedHeight =
            getItemHeightPx(this.props.item, width) -
            this.headerRef.current.clientHeight -
            this.itemHeaderTotalMargin -
            this.itemContentPadding

        const height = this.memoizedGetContentHeight(
            calculatedHeight,
            this.contentRef ? this.contentRef.offsetHeight : null,
            isEditMode(this.props.dashboardMode) ||
                isPrintMode(this.props.dashboardMode)
        )
        return `${height}px`
    }

    getAvailableWidth = () => {
        if (this.props.isFullscreen) {
            return '100%'
        }
        const rect = getGridItemElement(
            this.props.item.id
        )?.getBoundingClientRect()

        return rect && `${rect.width - this.itemContentPadding * 2}px`
    }

    onFatalError = () => {
        this.setState({ loadItemFailed: true })
    }

    render() {
        const {
            item,
            dashboardMode,
            itemFilters,
            isFullscreen,
            isSlideshowView,
            setSlideshow,
            sortIndex,
        } = this.props
        const { showFooter, showNoFiltersOverlay } = this.state
        const originalType = getItemTypeForVis(item)
        const activeType = this.getActiveType()

        const actionButtons =
            pluginIsAvailable(activeType || item.type, this.props.apps) &&
            isViewMode(dashboardMode) &&
            !isSlideshowView ? (
                <ItemContextMenu
                    item={item}
                    visualization={this.props.visualization}
                    onSelectActiveType={this.setActiveType}
                    onToggleFooter={this.onToggleFooter}
                    enterFullscreen={() => setSlideshow(sortIndex)}
                    activeType={activeType}
                    activeFooter={showFooter}
                    fullscreenSupported={this.isFullscreenSupported()}
                    loadItemFailed={this.state.loadItemFailed}
                />
            ) : null

        const getTags = (item) => {
            if (isViewMode(dashboardMode) && Object.keys(itemFilters).length) {
                switch (activeType) {
                    case EVENT_VISUALIZATION: {
                        return !showNoFiltersOverlay ? (
                            <Tooltip
                                content={i18n.t(
                                    'Filters are not applied to line list dashboard items'
                                )}
                            >
                                <Tag negative>
                                    {i18n.t('Filters not applied')}
                                </Tag>
                            </Tooltip>
                        ) : null
                    }
                    case CHART:
                    case VISUALIZATION: {
                        return item.type === VISUALIZATION &&
                            item.visualization.type ===
                                VIS_TYPE_OUTLIER_TABLE &&
                            Object.keys(itemFilters).some(
                                (filter) =>
                                    ![
                                        DIMENSION_ID_ORGUNIT,
                                        DIMENSION_ID_PERIOD,
                                    ].includes(filter)
                            ) ? (
                            <Tooltip
                                content={i18n.t(
                                    'Only Period and Organisation unit filters can be applied to this item'
                                )}
                            >
                                <Tag negative>
                                    {i18n.t('Some filters not applied')}
                                </Tag>
                            </Tooltip>
                        ) : null
                    }
                }
            }

            return null
        }

        return (
            <>
                <ItemHeader
                    title={getVisualizationName(item)}
                    itemId={item.id}
                    actionButtons={actionButtons}
                    ref={this.headerRef}
                    dashboardMode={dashboardMode}
                    isShortened={item.shortened}
                    tags={getTags(item)}
                />
                <FatalErrorBoundary
                    message={i18n.t(
                        'There was a problem loading this dashboard item'
                    )}
                    onFatalError={this.onFatalError}
                >
                    <div
                        className={cx(activeType, styles.content, {
                            [styles.fullscreen]: isFullscreen,
                            [styles.scrollbox]: activeType === EVENT_REPORT,
                            [styles.edit]: isEditMode(dashboardMode),
                            [styles.print]: isPrintMode(dashboardMode),
                        })}
                        ref={(ref) => (this.contentRef = ref)}
                    >
                        {this.state.configLoaded && (
                            <WindowDimensionsCtx.Consumer>
                                {(dimensions) => (
                                    <Visualization
                                        item={item}
                                        visualization={this.props.visualization}
                                        originalType={originalType}
                                        activeType={activeType}
                                        itemFilters={itemFilters}
                                        availableHeight={this.getAvailableHeight(
                                            dimensions
                                        )}
                                        availableWidth={this.getAvailableWidth()}
                                        gridWidth={this.props.gridWidth}
                                        dashboardMode={dashboardMode}
                                        showNoFiltersOverlay={Boolean(
                                            Object.keys(itemFilters).length &&
                                                showNoFiltersOverlay
                                        )}
                                        onClickNoFiltersOverlay={
                                            this.onClickNoFiltersOverlay
                                        }
                                    />
                                )}
                            </WindowDimensionsCtx.Consumer>
                        )}
                    </div>
                </FatalErrorBoundary>
                {isViewMode(dashboardMode) && showFooter ? (
                    <ItemFooter item={item} />
                ) : null}
            </>
        )
    }
}

Item.propTypes = {
    activeType: PropTypes.string,
    apps: PropTypes.array,
    dashboardMode: PropTypes.string,
    engine: PropTypes.object,
    gridWidth: PropTypes.number,
    isEditing: PropTypes.bool,
    isFullscreen: PropTypes.bool,
    isRecording: PropTypes.bool,
    isSlideshowView: PropTypes.bool,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    setActiveType: PropTypes.func,
    setSlideshow: PropTypes.func,
    setVisualization: PropTypes.func,
    settings: PropTypes.object,
    sortIndex: PropTypes.number,
    visualization: PropTypes.object,
    onToggleItemExpanded: PropTypes.func,
}

Item.defaultProps = {
    item: {},
    onToggleItemExpanded: Function.prototype,
    visualization: {},
}

const mapStateToProps = (state, ownProps) => {
    const itemFilters = !isEditMode(ownProps.dashboardMode)
        ? sGetItemFiltersRoot(state)
        : DEFAULT_STATE_ITEM_FILTERS

    return {
        activeType: sGetItemActiveType(state, ownProps.item?.id),
        isEditing: sGetIsEditing(state),
        itemFilters,
        visualization: sGetVisualization(
            state,
            getVisualizationId(ownProps.item)
        ),
        isSlideshowView: sGetSlideshow(state) !== null,
    }
}

const mapDispatchToProps = {
    setActiveType: acSetItemActiveType,
    setVisualization: acAddVisualization,
    setSlideshow: acSetSlideshow,
}

const ItemWithSettings = (props) => (
    <SystemSettingsCtx.Consumer>
        {({ systemSettings }) => <Item settings={systemSettings} {...props} />}
    </SystemSettingsCtx.Consumer>
)

export default connect(mapStateToProps, mapDispatchToProps)(ItemWithSettings)
