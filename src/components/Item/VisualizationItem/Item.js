import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import uniqueId from 'lodash/uniqueId'
import i18n from '@dhis2/d2-i18n'
import Visualization from './Visualization/Visualization'
import FatalErrorBoundary from './FatalErrorBoundary'
import ItemHeader from '../ItemHeader/ItemHeader'
import ItemContextMenu from './ItemContextMenu/ItemContextMenu'
import ItemFooter from './ItemFooter'
import { WindowDimensionsCtx } from '../../WindowDimensionsProvider'
import { SystemSettingsCtx } from '../../SystemSettingsProvider'
import { apiPostDataStatistics } from '../../../api/dataStatistics'
import { apiFetchVisualization } from '../../../api/metadata'
import { sGetVisualization } from '../../../reducers/visualizations'
import { sGetSelectedItemActiveType } from '../../../reducers/selected'
import { sGetIsEditing } from '../../../reducers/editDashboard'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../reducers/itemFilters'
import { acAddVisualization } from '../../../actions/visualizations'
import { acSetSelectedItemActiveType } from '../../../actions/selected'
import { pluginIsAvailable } from './Visualization/plugin'
import { getDataStatisticsName } from '../../../modules/itemTypes'
import { getVisualizationId, getVisualizationName } from '../../../modules/item'
import memoizeOne from '../../../modules/memoizeOne'
import {
    isEditMode,
    isPrintMode,
    isViewMode,
} from '../../Dashboard/dashboardModes'
import { getItemHeightPx } from '../../../modules/gridUtil'

export class Item extends Component {
    state = {
        showFooter: false,
        configLoaded: false,
        loadItemFailed: false,
    }

    constructor(props) {
        super(props)

        this.contentRef = React.createRef()
        this.headerRef = React.createRef()
        this.itemDomElSelector = `.reactgriditem-${this.props.item.id}`

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
        this.props.updateVisualization(
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

    isFullscreenSupported = () => {
        const el = document.querySelector(this.itemDomElSelector)
        return !!(el?.requestFullscreen || el?.webkitRequestFullscreen)
    }

    onToggleFullscreen = () => {
        if (!this.isFullscreen()) {
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

    getAvailableHeight = ({ width, height }) => {
        if (this.isFullscreen()) {
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
        const rect = document
            .querySelector(this.itemDomElSelector)
            ?.getBoundingClientRect()

        return rect && rect.width - this.itemContentPadding * 2
    }

    onFatalError = () => {
        this.setState({ loadItemFailed: true })
    }

    isFullscreen = () => {
        const fullscreenElement =
            document.fullscreenElement || document.webkitFullscreenElement

        return fullscreenElement?.classList.contains(
            `reactgriditem-${this.props.item.id}`
        )
    }

    render() {
        const { item, dashboardMode, itemFilters } = this.props
        const { showFooter } = this.state
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
                <FatalErrorBoundary
                    message={i18n.t(
                        'There was a problem loading this dashboard item'
                    )}
                    onFatalError={this.onFatalError}
                >
                    <div
                        key={this.getUniqueKey(itemFilters)}
                        className="dashboard-item-content"
                        ref={ref => (this.contentRef = ref)}
                    >
                        {this.state.configLoaded && (
                            <WindowDimensionsCtx.Consumer>
                                {dimensions => (
                                    <Visualization
                                        item={item}
                                        activeType={activeType}
                                        itemFilters={itemFilters}
                                        availableHeight={this.getAvailableHeight(
                                            dimensions
                                        )}
                                        availableWidth={this.getAvailableWidth()}
                                        gridWidth={this.props.gridWidth}
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
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    setActiveType: PropTypes.func,
    settings: PropTypes.object,
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
    }
}

const mapDispatchToProps = {
    setActiveType: acSetSelectedItemActiveType,
    updateVisualization: acAddVisualization,
}

const ItemWithSettings = props => (
    <SystemSettingsCtx.Consumer>
        {({ settings }) => <Item settings={settings} {...props} />}
    </SystemSettingsCtx.Consumer>
)

export default connect(mapStateToProps, mapDispatchToProps)(ItemWithSettings)
