import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ReactGridLayout from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'

import {
    acUpdateDashboardLayout,
    acRemoveDashboardItem,
} from '../../actions/editDashboard'
import { Item } from '../Item/Item'
import { resize as pluginResize } from '../Item/VisualizationItem/plugin'
import { isVisualizationType } from '../../modules/itemTypes'
import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    MARGIN,
    getGridColumns,
    hasShape,
    onItemResize,
} from './gridUtil'
import { orArray } from '../../modules/util'
import {
    isViewMode,
    isEditMode,
    isPrintLayoutMode,
} from '../Dashboard/dashboardModes'

import NoContentMessage from '../../widgets/NoContentMessage'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import './ItemGrid.css'
import {
    sGetSelectedId,
    sGetSelectedIsLoading,
    sGetSelectedDashboardMode,
} from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import ProgressiveLoadingContainer from '../Item/ProgressiveLoadingContainer'

// Component

const EXPANDED_HEIGHT = 17
// this is set in the .dashboard-item-content css
export const ITEM_CONTENT_PADDING_BOTTOM = 4

export class ItemGrid extends Component {
    state = {
        expandedItems: {},
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

    onRemoveItem = clickedId => {
        this.props.acRemoveDashboardItem(clickedId)
    }

    componentWillReceiveProps(nextProps) {
        if (!isViewMode(nextProps.dashboardMode)) {
            this.setState({ expandedItems: {} })
        }
    }

    onLayoutChange = newLayout => {
        if (!isViewMode(this.props.dashboardMode)) {
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

    onRemoveItemWrapper = id => () => this.onRemoveItem(id)

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
        let modeClass = ''
        if (
            isEditMode(this.props.dashboardMode) ||
            isPrintLayoutMode(this.props.dashboardMode)
        ) {
            modeClass = 'edit'
        } else if (isViewMode(this.props.dashboardMode)) {
            modeClass = 'view'
        }

        const itemClassNames = [item.type, modeClass].join(' ')

        return (
            <ProgressiveLoadingContainer
                key={item.i}
                className={itemClassNames}
            >
                <Item
                    item={item}
                    onToggleItemExpanded={this.onToggleItemExpanded}
                />
            </ProgressiveLoadingContainer>
        )
    }

    getItemComponents = items => items.map(item => this.getItemComponent(item))

    render() {
        const { dashboardMode, isLoading, dashboardItems } = this.props

        if (!isLoading && !dashboardItems.length) {
            return (
                <NoContentMessage
                    text={i18n.t('There are no items on this dashboard')}
                />
            )
        }

        const items = !isViewMode(dashboardMode)
            ? dashboardItems
            : dashboardItems.map(this.adjustHeightForExpanded)

        const allowResize = !isViewMode(dashboardMode)

        return (
            <div className="grid-wrapper">
                {isLoading ? (
                    <Layer translucent>
                        <CenteredContent>
                            <CircularLoader />
                        </CenteredContent>
                    </Layer>
                ) : null}
                <ReactGridLayout
                    onLayoutChange={this.onLayoutChange}
                    onResizeStop={this.onResizeStop}
                    className="layout"
                    layout={items}
                    margin={MARGIN}
                    cols={getGridColumns()}
                    rowHeight={GRID_ROW_HEIGHT}
                    width={window.innerWidth}
                    compactType={GRID_COMPACT_TYPE}
                    isDraggable={allowResize}
                    isResizable={allowResize}
                    draggableCancel="input,textarea"
                >
                    {this.getItemComponents(items)}
                </ReactGridLayout>
            </div>
        )
    }
}

ItemGrid.propTypes = {
    acRemoveDashboardItem: PropTypes.func,
    acUpdateDashboardLayout: PropTypes.func,
    dashboardItems: PropTypes.array,
    dashboardMode: PropTypes.string,
    isLoading: PropTypes.bool,
}

ItemGrid.defaultProps = {
    dashboardItems: [],
}

// Container

const mapStateToProps = state => {
    const dashboardMode = sGetSelectedDashboardMode(state)

    const selectedDashboard = !isViewMode(dashboardMode)
        ? sGetEditDashboardRoot(state)
        : sGetDashboardById(state, sGetSelectedId(state))

    const dashboardItems = !isViewMode(dashboardMode)
        ? sGetEditDashboardItems(state)
        : sGetDashboardItems(state)

    return {
        isLoading: sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems,
        dashboardMode,
    }
}

const mapDispatchToProps = {
    acUpdateDashboardLayout,
    acRemoveDashboardItem,
}

const mergeProps = (stateProps, dispatchProps) => {
    const validItems = orArray(stateProps.dashboardItems).filter(hasShape)

    return {
        ...dispatchProps,
        dashboardMode: stateProps.dashboardMode,
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
