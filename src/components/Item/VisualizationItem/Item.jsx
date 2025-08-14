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
import { sGetVisualization } from '../../../reducers/visualizations.js'
import { useSystemSettings } from '../../AppDataProvider/AppDataProvider.jsx'
import FatalErrorBoundary from '../FatalErrorBoundary.jsx'
import { getAvailableDimensions } from '../getAvailableDimensions.js'
import ItemHeader from '../ItemHeader/ItemHeader.jsx'
import ItemContextMenu from './ItemContextMenu/ItemContextMenu.jsx'
import ItemFooter from './ItemFooter.jsx'
import styles from './styles/Item.module.css'
import { pluginIsAvailable } from './Visualization/plugin.js'
import Visualization from './Visualization/Visualization.jsx'

const DEFAULT_VISUALIZATION = {}

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
    }

    async componentDidMount() {
        try {
            // Avoid refetching the visualization already in the Redux store
            // when the same dashboard item is added again.
            // This also solves a flashing of all the "duplicated" dashboard items.
            if (!this.props.visualization.id) {
                const vis = await apiFetchVisualization(
                    this.props.item,
                    this.props.engine
                )

                this.props.setVisualization(vis[this.props.item.type])
            }

            // force fetch when recording to allow caching of the visualizations request
            if (this.props.isRecording) {
                apiFetchVisualization(this.props.item, this.props.engine)
            }

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
            apiFetchVisualization(this.props.item, this.props.engine)
        }

        if (this.props.item.h !== prevProps.item.h) {
            this.setState({ showFooter: !this.state.showFooter })
        }
    }

    onClickNoFiltersOverlay = () =>
        this.setState({ showNoFiltersOverlay: false })

    onToggleFooter = () => {
        this.props.onToggleItemExpanded(this.props.item.id)
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
            windowDimensions,
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
                    enterFullscreen={() =>
                        setSlideshow({
                            firstItemIndex: sortIndex,
                            startPlaying: false,
                        })
                    }
                    activeType={activeType}
                    activeFooter={showFooter}
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
                        ref={this.contentRef}
                    >
                        {this.state.configLoaded && (
                            <Visualization
                                item={item}
                                visualization={this.props.visualization}
                                originalType={originalType}
                                activeType={activeType}
                                itemFilters={itemFilters}
                                style={getAvailableDimensions({
                                    item,
                                    headerRef: this.headerRef,
                                    contentRef: this.contentRef,
                                    dashboardMode,
                                    windowDimensions,
                                    isFullscreen,
                                })}
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
    item: PropTypes.object.isRequired,
    itemFilters: PropTypes.object.isRequired,
    activeType: PropTypes.string,
    apps: PropTypes.array,
    dashboardMode: PropTypes.string,
    engine: PropTypes.object,
    gridWidth: PropTypes.number,
    isEditing: PropTypes.bool,
    isFullscreen: PropTypes.bool,
    isRecording: PropTypes.bool,
    isSlideshowView: PropTypes.bool,
    setActiveType: PropTypes.func,
    setSlideshow: PropTypes.func,
    setVisualization: PropTypes.func,
    settings: PropTypes.object,
    sortIndex: PropTypes.number,
    visualization: PropTypes.object,
    windowDimensions: PropTypes.object,
    onToggleItemExpanded: PropTypes.func,
}

Item.defaultProps = {
    onToggleItemExpanded: Function.prototype,
    visualization: DEFAULT_VISUALIZATION,
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
    setSlideshow: acSetSlideshow,
}

const ItemWithSettings = (props) => {
    const systemSettings = useSystemSettings()
    return <Item settings={systemSettings} {...props} />
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemWithSettings)
