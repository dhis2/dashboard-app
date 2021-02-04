import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import uniqueId from 'lodash/uniqueId'

import Visualization from './Visualization/Visualization'
import FatalErrorBoundary from './FatalErrorBoundary'
import ItemHeader, { HEADER_MARGIN_HEIGHT } from '../ItemHeader/ItemHeader'
import ItemHeaderButtons from './ItemHeaderButtons'
import ItemFooter from './ItemFooter'
import { WindowDimensionsCtx } from '../../WindowDimensionsProvider'
import { apiPostDataStatistics } from '../../../api/dataStatistics'
import { apiFetchVisualization } from '../../../api/metadata'
import { sGetVisualization } from '../../../reducers/visualizations'
import { sGetSelectedItemActiveType } from '../../../reducers/selected'
import { sGetIsEditing } from '../../../reducers/editDashboard'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../reducers/itemFilters'
import { sGatherAnalyticalObjectStatisticsInDashboardViews } from '../../../reducers/settings'
import { acAddVisualization } from '../../../actions/visualizations'
import { acSetSelectedItemActiveType } from '../../../actions/selected'
import {
    pluginIsAvailable,
    resize as pluginResize,
} from './Visualization/plugin'
import { getDataStatisticsName } from '../../../modules/itemTypes'
import { getVisualizationId, getVisualizationName } from '../../../modules/item'
import memoizeOne from '../../../modules/memoizeOne'
import {
    isEditMode,
    isPrintMode,
    isViewMode,
} from '../../Dashboard/dashboardModes'
import { getItemHeightPx } from '../../../modules/gridUtil'
import getGridItemDomId from '../../../modules/getGridItemDomId'

// this is set in the .dashboard-item-content css
const ITEM_CONTENT_PADDING = 4

export class Item extends Component {
    state = {
        showFooter: false,
        configLoaded: false,
        isFullscreen: false,
    }

    constructor(props) {
        super(props)

        this.contentRef = React.createRef()
        this.headerRef = React.createRef()
        this.itemDomElSelector = `.reactgriditem-${this.props.item.id}`

        this.memoizedGetContentHeight = memoizeOne(
            (calculatedHeight, measuredHeight, preferMeasured) =>
                preferMeasured
                    ? measuredHeight || calculatedHeight
                    : calculatedHeight
        )
    }

    async componentDidMount() {
        this.props.updateVisualization(
            await apiFetchVisualization(this.props.item)
        )

        try {
            if (
                this.props.gatherDataStatistics &&
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

        const el = document.querySelector(this.itemDomElSelector)
        if (el?.requestFullscreen) {
            el.onfullscreenchange = this.handleFullscreenChange
        } else if (el?.webkitRequestFullscreen) {
            el.onwebkitfullscreenchange = this.handleFullscreenChange
        }
    }

    componentWillUnmount() {
        const el = document.querySelector(this.itemDomElSelector)
        if (el?.onfullscreenchange) {
            el.removeEventListener(
                'onfullscreenchange',
                this.handleFullscreenChange
            )
        } else if (el?.onwebkitfullscreenchange) {
            el.removeEventListener(
                'onwebkitfullscreenchange',
                this.handleFullscreenChange
            )
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.gridWidth !== this.props.gridWidth) {
            const el = document.querySelector(
                `#${getGridItemDomId(this.props.item.id)}`
            )
            if (typeof el?.setViewportSize === 'function') {
                setTimeout(
                    () =>
                        el.setViewportSize(
                            el.clientWidth - 5,
                            el.clientHeight - 5
                        ),
                    10
                )
            }
            // call resize on Map item
            pluginResize(this.props.item, this.state.isFullscreen)
        }
    }

    isFullscreenSupported = () => {
        const el = document.querySelector(this.itemDomElSelector)
        return !!(el?.requestFullscreen || el?.webkitRequestFullscreen)
    }

    handleFullscreenChange = () => {
        this.setState(
            {
                isFullscreen:
                    !!document.fullscreenElement ||
                    !!document.webkitFullscreenElement,
            },
            () => pluginResize(this.props.item, this.state.isFullscreen)
        )
    }

    onToggleFullscreen = () => {
        if (!this.state.isFullscreen) {
            const el = document.querySelector(this.itemDomElSelector)
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

    getUniqueKey = memoizeOne(() => uniqueId())

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
            return this.props.item.type
        }
        return this.props.activeType || this.props.item.type
    }

    getAvailableHeight = () => {
        if (this.state.isFullscreen) {
            return '95vh'
        }

        const { width } = this.context

        const calculatedHeight =
            getItemHeightPx(this.props.item, width) -
            this.headerRef.current.clientHeight -
            HEADER_MARGIN_HEIGHT -
            ITEM_CONTENT_PADDING

        return this.memoizedGetContentHeight(
            calculatedHeight,
            this.contentRef ? this.contentRef.offsetHeight : null,
            isEditMode(this.props.dashboardMode) ||
                isPrintMode(this.props.dashboardMode)
        )
    }

    getAvailableWidth = () => {
        const rect = document
            .querySelector(this.itemDomElSelector)
            ?.getBoundingClientRect()
        return rect && rect.width - ITEM_CONTENT_PADDING * 2
    }

    render() {
        const { item, dashboardMode, itemFilters } = this.props
        const { showFooter } = this.state
        const activeType = this.getActiveType()

        const actionButtons = pluginIsAvailable(activeType || item.type) ? (
            <ItemHeaderButtons
                item={item}
                visualization={this.props.visualization}
                onSelectActiveType={this.setActiveType}
                onToggleFooter={this.onToggleFooter}
                onToggleFullscreen={this.onToggleFullscreen}
                activeType={activeType}
                activeFooter={showFooter}
                isFullscreen={this.state.isFullscreen}
                fullscreenSupported={this.isFullscreenSupported()}
            />
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
                />
                <FatalErrorBoundary>
                    <div
                        key={this.getUniqueKey(itemFilters)}
                        className="dashboard-item-content"
                        ref={ref => (this.contentRef = ref)}
                    >
                        {this.state.configLoaded && (
                            <Visualization
                                item={item}
                                activeType={activeType}
                                itemFilters={itemFilters}
                                availableHeight={this.getAvailableHeight()}
                                availableWidth={this.getAvailableWidth()}
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

Item.contextType = WindowDimensionsCtx

Item.propTypes = {
    activeType: PropTypes.string,
    dashboardMode: PropTypes.string,
    gatherDataStatistics: PropTypes.bool,
    gridWidth: PropTypes.number,
    isEditing: PropTypes.bool,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    setActiveType: PropTypes.func,
    updateVisualization: PropTypes.func,
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
        activeType: sGetSelectedItemActiveType(state, ownProps.item?.id),
        isEditing: sGetIsEditing(state),
        itemFilters,
        visualization: sGetVisualization(
            state,
            getVisualizationId(ownProps.item)
        ),
        gatherDataStatistics: sGatherAnalyticalObjectStatisticsInDashboardViews(
            state
        ),
    }
}

const mapDispatchToProps = {
    setActiveType: acSetSelectedItemActiveType,
    updateVisualization: acAddVisualization,
}

export default connect(mapStateToProps, mapDispatchToProps)(Item)
