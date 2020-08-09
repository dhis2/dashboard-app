import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ReactGridLayout from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'

import { Item } from '../Item/Item'
import NoContentMessage from '../../widgets/NoContentMessage'

import { acUpdateDashboardLayout } from '../../actions/editDashboard'
import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'

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

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import './ItemGrid.css'

export class ItemGrid extends Component {
    onLayoutChange = newLayout => {
        this.props.acUpdateDashboardLayout(newLayout)
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

    getItemComponent = item => {
        const itemClassNames = [item.type, 'edit'].join(' ')

        return (
            <div key={item.i} className={itemClassNames}>
                <Item
                    item={item}
                    editMode={true}
                    onToggleItemExpanded={this.onToggleItemExpanded}
                />
            </div>
        )
    }

    getItemComponents = items => items.map(item => this.getItemComponent(item))

    render() {
        const { isLoading, dashboardItems } = this.props

        if (!isLoading && !dashboardItems.length) {
            return (
                <NoContentMessage
                    text={i18n.t('There are no items on this dashboard')}
                />
            )
        }

        const items = dashboardItems

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
                    isDraggable={false}
                    isResizable={false}
                    draggableCancel="input,textarea"
                >
                    {this.getItemComponents(items)}
                </ReactGridLayout>
            </div>
        )
    }
}

ItemGrid.propTypes = {
    acUpdateDashboardLayout: PropTypes.func,
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
}

ItemGrid.defaultProps = {
    dashboardItems: [],
}

// Container

const mapStateToProps = state => {
    const selectedDashboard = sGetEditDashboardRoot(state)

    const dashboardItems = sGetEditDashboardItems(state)

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
