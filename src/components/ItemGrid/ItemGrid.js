import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'

import { acUpdateDashboardLayout } from '../../actions/editDashboard'
import { Item } from '../Item/Item'
import { resize as pluginResize } from '../Item/VisualizationItem/Visualization/plugin'
import { isVisualizationType } from '../../modules/itemTypes'
import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    MARGIN,
    hasShape,
    onItemResize,
} from './gridUtil'
import { orArray } from '../../modules/util'

import NoContentMessage from '../../widgets/NoContentMessage'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import './ItemGrid.css'
import { sGetSelectedId, sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import ProgressiveLoadingContainer from '../Item/ProgressiveLoadingContainer'
import { VIEW, EDIT } from '../Dashboard/dashboardModes'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

// Component

const EXPANDED_HEIGHT = 17
// this is set in the .dashboard-item-content css
export const ITEM_CONTENT_PADDING_BOTTOM = 4

export class ItemGrid extends Component {
    state = {
        expandedItems: {},
        //adding states for grid
        currentBreakpoint: 'lg',
        compactType: GRID_COMPACT_TYPE,
        mounted: false,
        layouts: { lg: this.props.dashboardItems },
    }

    onToggleItemExpanded = clickedId => {
        const isExpanded =
            typeof this.state.expandedItems[clickedId] === 'boolean'
                ? this.state.expandedItems[clickedId]
                : false

        const expandedItems = { ...this.state.expandedItems }
        expandedItems[clickedId] = !isExpanded
        this.setState({ expandedItems })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.edit) {
            this.setState({ expandedItems: {} })
        }
    }

    onLayoutChange = newLayout => {
        if (this.props.edit) {
            this.props.acUpdateDashboardLayout(newLayout)
        }
    }

    onResizeStop = (layout, oldItem, newItem) => {
        onItemResize(newItem.i)

        const dashboardItem = this.props.dashboardItems.find(
            item => item.id === newItem.i
        )

        // call resize on the item component if it's a plugin type
        if (dashboardItem && isVisualizationType(dashboardItem)) {
            pluginResize(dashboardItem)
        }
    }

    adjustHeightForExpanded = dashboardItem => {
        const expandedItem = this.state.expandedItems[dashboardItem.id]

        if (expandedItem && expandedItem === true) {
            return Object.assign({}, dashboardItem, {
                h: dashboardItem.h + EXPANDED_HEIGHT,
            })
        }

        return dashboardItem
    }

    getItemComponent = item => {
        const itemClassNames = [
            item.type,
            this.props.edit ? 'edit' : 'view',
        ].join(' ')

        return (
            <ProgressiveLoadingContainer
                key={item.i}
                className={itemClassNames}
                itemId={item.id}
            >
                <Item
                    item={item}
                    dashboardMode={this.props.edit ? EDIT : VIEW}
                    onToggleItemExpanded={this.onToggleItemExpanded}
                />
            </ProgressiveLoadingContainer>
        )
    }

    onBreakpointChange = breakpoint => {
        this.setState({
            currentBreakpoint: breakpoint,
        })
    }

    getItemComponents = items => items.map(item => this.getItemComponent(item))

    render() {
        const { edit, isLoading, dashboardItems } = this.props
        if (!isLoading && !dashboardItems.length) {
            return (
                <NoContentMessage
                    text={i18n.t('There are no items on this dashboard')}
                />
            )
        }

        const items = edit
            ? dashboardItems
            : dashboardItems.map(this.adjustHeightForExpanded)

        return (
            <div className="grid-wrapper">
                {isLoading ? (
                    <Layer translucent>
                        <CenteredContent>
                            <CircularLoader />
                        </CenteredContent>
                    </Layer>
                ) : null}
                <ResponsiveReactGridLayout
                    {...this.props}
                    layouts={this.state.layouts}
                    onBreakpointChange={this.onBreakpointChange}
                    onLayoutChange={this.onLayoutChange}
                    measureBeforeMount={false}
                    useCSSTransforms={this.state.mounted}
                    compactType={this.state.compactType}
                    preventCollision={!this.state.compactType}
                    onResizeStop={this.onResizeStop}
                    width={window.innerWidth}
                    margin={MARGIN}
                    isDraggable={edit}
                    isResizable={edit}
                    draggableCancel="input,textarea"
                >
                    {this.getItemComponents(items)}
                </ResponsiveReactGridLayout>
            </div>
        )
    }
}

ItemGrid.propTypes = {
    acUpdateDashboardLayout: PropTypes.func,
    dashboardItems: PropTypes.array,
    edit: PropTypes.bool,
    isLoading: PropTypes.bool,
}

ItemGrid.defaultProps = {
    dashboardItems: [],
    className: 'layout',
    rowHeight: GRID_ROW_HEIGHT,
    onLayoutChange: function () {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
}

// Container

const mapStateToProps = (state, ownProps) => {
    const selectedDashboard = ownProps.edit
        ? sGetEditDashboardRoot(state)
        : sGetDashboardById(state, sGetSelectedId(state))

    const dashboardItems = ownProps.edit
        ? sGetEditDashboardItems(state)
        : sGetDashboardItems(state)

    return {
        isLoading: sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems,
    }
}

const mapDispatchToProps = {
    acUpdateDashboardLayout,
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const validItems = orArray(stateProps.dashboardItems).filter(hasShape)

    return {
        ...dispatchProps,
        edit: ownProps.edit,
        isLoading: stateProps.isLoading,
        dashboardItems: validItems,
        onItemResize,
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(ItemGrid)
