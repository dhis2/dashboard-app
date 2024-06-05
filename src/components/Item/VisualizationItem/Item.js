import i18n from '@dhis2/d2-i18n'
import { Tag, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { acSetItemActiveType } from '../../../actions/itemActiveTypes'
import { acAddVisualization } from '../../../actions/visualizations'
import { apiPostDataStatistics } from '../../../api/dataStatistics'
import { apiFetchVisualization } from '../../../api/fetchVisualization'
import {
    isEditMode,
    isPrintMode,
    isViewMode,
} from '../../../modules/dashboardModes'
import { getItemHeightPx } from '../../../modules/gridUtil'
import { getVisualizationId, getVisualizationName } from '../../../modules/item'
import {
    getDataStatisticsName,
    getItemTypeForVis,
    EVENT_VISUALIZATION,
} from '../../../modules/itemTypes.js'
import { sGetIsEditing } from '../../../reducers/editDashboard.js'
import { sGetItemActiveType } from '../../../reducers/itemActiveTypes.js'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../reducers/itemFilters'
import { sGetVisualization } from '../../../reducers/visualizations'
import { SystemSettingsCtx } from '../../SystemSettingsProvider'
import { WindowDimensionsCtx } from '../../WindowDimensionsProvider'
import ItemHeader from '../ItemHeader/ItemHeader'
import FatalErrorBoundary from './FatalErrorBoundary'
import { getGridItemElement } from './getGridItemElement'
import { isElementFullscreen } from './isElementFullscreen'
import ItemContextMenu from './ItemContextMenu/ItemContextMenu'
import ItemFooter from './ItemFooter'
import memoizeOne from './memoizeOne'
import { pluginIsAvailable } from './Visualization/plugin'
import Visualization from './Visualization/Visualization'

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
                    getVisualizationId(this.props.item)
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

    onToggleFullscreen = () => {
        if (!isElementFullscreen(this.props.item.id)) {
            const el = getGridItemElement(this.props.item.id)
            if (el?.requestFullscreen) {
                el.requestFullscreen()
            } else if (el?.webkitRequestFullscreen) {
                el.webkitRequestFullscreen()
            }
        } else {
            document.exitFullscreen
                ? document.exitFullscreen()
                : document.webkitExitFullscreen()
        }
    }

    onToggleFooter = () => {
        this.setState(
            { showFooter: !this.state.showFooter },
            this.props.onToggleItemExpanded(this.props.item.id)
        )
    }

    setActiveType = type => {
        type !== this.getActiveType() &&
            this.props.setActiveType(this.props.item.id, type)
    }

    getActiveType = () => {
        if (this.props.isEditing) {
            return getItemTypeForVis(this.props.item)
        }
        return this.props.activeType || getItemTypeForVis(this.props.item)
    }

    getAvailableHeight = ({ width, height }) => {
        if (isElementFullscreen(this.props.item.id)) {
            return (
                height -
                this.headerRef.current.clientHeight -
                this.itemHeaderTotalMargin -
                this.itemContentPadding
            )
        }

        const calculatedHeight =
            getItemHeightPx(this.props.item, width) -
            this.headerRef.current.clientHeight -
            this.itemHeaderTotalMargin -
            this.itemContentPadding

        return this.memoizedGetContentHeight(
            calculatedHeight,
            this.contentRef ? this.contentRef.offsetHeight : null,
            isEditMode(this.props.dashboardMode) ||
                isPrintMode(this.props.dashboardMode)
        )
    }

    getAvailableWidth = () => {
        const rect = getGridItemElement(
            this.props.item.id
        )?.getBoundingClientRect()

        return rect && rect.width - this.itemContentPadding * 2
    }

    onFatalError = () => {
        this.setState({ loadItemFailed: true })
    }

    render() {
        const { item, dashboardMode, itemFilters } = this.props
        const { showFooter, showNoFiltersOverlay } = this.state
        const originalType = getItemTypeForVis(item)
        const activeType = this.getActiveType()

        const actionButtons =
            pluginIsAvailable(activeType || item.type) &&
            isViewMode(dashboardMode) ? (
                <ItemContextMenu
                    item={item}
                    visualization={this.props.visualization}
                    onSelectActiveType={this.setActiveType}
                    onToggleFooter={this.onToggleFooter}
                    onToggleFullscreen={this.onToggleFullscreen}
                    activeType={activeType}
                    activeFooter={showFooter}
                    fullscreenSupported={this.isFullscreenSupported()}
                    loadItemFailed={this.state.loadItemFailed}
                />
            ) : null

        const tags =
            isViewMode(dashboardMode) &&
            Object.keys(itemFilters).length &&
            !showNoFiltersOverlay &&
            activeType === EVENT_VISUALIZATION ? (
                <Tooltip
                    content={i18n.t(
                        'Filters are not applied to line list dashboard items'
                    )}
                >
                    <Tag negative>{i18n.t('Filters not applied')}</Tag>
                </Tooltip>
            ) : null

        return (
            <>
                <ItemHeader
                    title={getVisualizationName(item)}
                    itemId={item.id}
                    actionButtons={actionButtons}
                    ref={this.headerRef}
                    dashboardMode={dashboardMode}
                    isShortened={item.shortened}
                    tags={tags}
                />
                <FatalErrorBoundary
                    message={i18n.t(
                        'There was a problem loading this dashboard item'
                    )}
                    onFatalError={this.onFatalError}
                >
                    <div
                        className="dashboard-item-content"
                        ref={ref => (this.contentRef = ref)}
                    >
                        {this.state.configLoaded && (
                            <WindowDimensionsCtx.Consumer>
                                {dimensions => (
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
    dashboardMode: PropTypes.string,
    gridWidth: PropTypes.number,
    isEditing: PropTypes.bool,
    isRecording: PropTypes.bool,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    setActiveType: PropTypes.func,
    setVisualization: PropTypes.func,
    settings: PropTypes.object,
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
    }
}

const mapDispatchToProps = {
    setActiveType: acSetItemActiveType,
    setVisualization: acAddVisualization,
}

const ItemWithSettings = props => (
    <SystemSettingsCtx.Consumer>
        {({ systemSettings }) => <Item settings={systemSettings} {...props} />}
    </SystemSettingsCtx.Consumer>
)

export default connect(mapStateToProps, mapDispatchToProps)(ItemWithSettings)
