import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import uniqueId from 'lodash/uniqueId'
import VisualizationPlugin from '@dhis2/data-visualizer-plugin'
import i18n from '@dhis2/d2-i18n'

import DefaultPlugin from './DefaultPlugin'
import MapPlugin from './MapPlugin'
import FatalErrorBoundary from './FatalErrorBoundary'
import ItemHeader, { HEADER_MARGIN_HEIGHT } from '../ItemHeader/ItemHeader'
import ItemHeaderButtons from './ItemHeaderButtons'
import ItemFooter from './ItemFooter'
import LoadingMask from './LoadingMask'
import NoVisualizationMessage from './NoVisualizationMessage'

import { apiPostDataStatistics } from '../../../api/dataStatistics'
import { apiFetchVisualization } from '../../../api/metadata'
import getVisualizationConfig from './getVisualizationConfig'
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
    VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
    getDataStatisticsName,
} from '../../../modules/itemTypes'
import { getVisualizationId, getVisualizationName } from '../../../modules/item'
import memoizeOne from '../../../modules/memoizeOne'
import {
    isEditMode,
    isPrintMode,
    isViewMode,
} from '../../Dashboard/dashboardModes'

import { ITEM_CONTENT_PADDING_BOTTOM } from '../../ItemGrid/ItemGrid'

export class Item extends Component {
    state = {
        showFooter: false,
        configLoaded: false,
        pluginIsLoaded: false,
    }

    constructor(props, context) {
        super(props)

        this.d2 = context.d2

        this.contentRef = React.createRef()
        this.headerRef = React.createRef()

        this.memoizedApplyFilters = memoizeOne(this.applyFilters)

        this.memoizedGetVisualizationConfig = memoizeOne(getVisualizationConfig)

        this.memoizedGetContentHeight = memoizeOne(this.getContentHeight)
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

        this.setState({
            configLoaded: true,
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.pluginIsLoaded &&
            (prevProps.visualization !== this.props.visualization ||
                prevProps.itemFilters !== this.props.itemFilters)
        ) {
            this.setState({
                pluginIsLoaded: false,
            })
        }
    }

    applyFilters = (visualization, filters) => {
        if (!Object.keys(filters).length) {
            return visualization
        }

        // deep clone objects in filters to avoid changing the visualization in the Redux store
        const visRows = visualization.rows.map(obj => ({ ...obj }))
        const visColumns = visualization.columns.map(obj => ({ ...obj }))
        const visFilters = visualization.filters.map(obj => ({ ...obj }))

        Object.keys(filters).forEach(dimensionId => {
            if (filters[dimensionId]) {
                let dimensionFound = false

                ;[visRows, visColumns, visFilters].forEach(dimensionObjects =>
                    dimensionObjects
                        .filter(obj => obj.dimension === dimensionId)
                        .forEach(obj => {
                            dimensionFound = true
                            obj.items = filters[dimensionId]
                        })
                )

                // add dimension to filters if not already present elsewhere
                if (!dimensionFound) {
                    visFilters.push({
                        dimension: dimensionId,
                        items: filters[dimensionId],
                    })
                }
            }
        })

        return {
            ...visualization,
            rows: visRows,
            columns: visColumns,
            filters: visFilters,
        }
    }

    getUniqueKey = memoizeOne(() => uniqueId())

    pluginCredentials = null

    getPluginComponent = () => {
        const activeType = this.getActiveType()
        const visualization = this.memoizedGetVisualizationConfig(
            this.props.visualization,
            this.props.item.type,
            activeType
        )

        if (!visualization) {
            return (
                <NoVisualizationMessage
                    message={i18n.t('No data to display')}
                />
            )
        }

        const props = {
            item: this.props.item,
            itemFilters: this.props.itemFilters,
            activeType,
            visualization,
            style: this.getPluginStyle(),
        }

        switch (activeType) {
            case VISUALIZATION:
            case CHART:
            case REPORT_TABLE: {
                return (
                    <>
                        {!this.state.pluginIsLoaded && (
                            <div style={props.style}>
                                <LoadingMask />
                            </div>
                        )}
                        <VisualizationPlugin
                            d2={this.d2}
                            visualization={this.memoizedApplyFilters(
                                visualization,
                                props.itemFilters
                            )}
                            onLoadingComplete={this.onLoadingComplete}
                            forDashboard={true}
                            style={props.style}
                        />
                    </>
                )
            }
            case MAP: {
                return (
                    <MapPlugin
                        applyFilters={this.memoizedApplyFilters}
                        {...props}
                    />
                )
            }
            default: {
                props.visualization = this.memoizedApplyFilters(
                    props.visualization,
                    props.itemFilters
                )

                return <DefaultPlugin {...props} />
            }
        }
    }

    onLoadingComplete = () => {
        this.setState({
            pluginIsLoaded: true,
        })
    }

    onToggleFooter = () => {
        this.setState(
            { showFooter: !this.state.showFooter },
            this.props.onToggleItemExpanded(this.props.item.id)
        )
    }

    selectActiveType = type => {
        type !== this.getActiveType() &&
            this.props.selectActiveType(this.props.item.id, type)
    }

    getActiveType = () => {
        if (this.props.isEditing) {
            return this.props.item.type
        }
        return this.props.activeType || this.props.item.type
    }

    getPluginStyle = () => {
        const calculatedHeight =
            this.props.item.originalHeight -
            this.headerRef.current.clientHeight -
            HEADER_MARGIN_HEIGHT -
            ITEM_CONTENT_PADDING_BOTTOM

        return this.memoizedGetContentHeight(
            calculatedHeight,
            this.contentRef ? this.contentRef.offsetHeight : null,
            isEditMode(this.props.dashboardMode) ||
                isPrintMode(this.props.dashboardMode)
        )
    }

    getContentHeight = (calculatedHeight, measuredHeight, preferMeasured) => {
        const height = preferMeasured
            ? measuredHeight || calculatedHeight
            : calculatedHeight

        return { height }
    }

    render() {
        const { item, dashboardMode, itemFilters } = this.props
        const { showFooter } = this.state

        const actionButtons = (
            <ItemHeaderButtons
                item={item}
                visualization={this.props.visualization}
                onSelectActiveType={this.selectActiveType}
                onToggleFooter={this.onToggleFooter}
                activeType={this.getActiveType()}
                activeFooter={this.state.showFooter}
            />
        )

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
                        {this.state.configLoaded && this.getPluginComponent()}
                    </div>
                </FatalErrorBoundary>
                {isViewMode(dashboardMode) && showFooter ? (
                    <ItemFooter item={item} />
                ) : null}
            </>
        )
    }
}

Item.contextTypes = {
    d2: PropTypes.object,
}

Item.propTypes = {
    activeType: PropTypes.string,
    dashboardMode: PropTypes.string,
    gatherDataStatistics: PropTypes.bool,
    isEditing: PropTypes.bool,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    selectActiveType: PropTypes.func,
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
    selectActiveType: acSetSelectedItemActiveType,
    updateVisualization: acAddVisualization,
}

export default connect(mapStateToProps, mapDispatchToProps)(Item)
