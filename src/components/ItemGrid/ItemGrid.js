import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import {Responsive, WidthProvider} from 'react-grid-layout'
const ResponsiveReactGridLayout = WidthProvider(Responsive)
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'

import { acUpdateDashboardLayout } from '../../actions/editDashboard'
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

//grid
const generateLayout = (items) => {

    /*return _.map(_.range(0, 25), function(item, i) {
        var y = Math.ceil(Math.random() * 4) + 1

        //console.log('layout', {x, y: Math.floor(i / 4) * 20, w:2 , h: y, i, itemWidth: Math.floor(59/4)})

        return {
            x: (_.random(0, 3) * 3 ) % 12, //(_.random(0, 5) * 2) % 12,
            y: Math.floor(i / 4) * 20,
            w: 3,
            h: 10 * 2,
            i: i.toString(),
            //static: Math.random() < 0.05
        }
    })*/

    return items.map(item => {
        const col = (_.random(0, 3) * 3 ) % 12 //(item) % 12
        const row = Math.floor(item/4)
        const itemWidth = 3 //Math.floor(59 / 4)
        const itemHeight = 10 * 2//GRID_ROW_HEIGHT * 2 (10*2)

        console.log({x: col, y: row * itemHeight, item})

        return {
            x: col,
            y: row * itemHeight,
            w: itemWidth,
            h: itemHeight,
        }
    })
}

// Component

const EXPANDED_HEIGHT = 17
// this is set in the .dashboard-item-content css
export const ITEM_CONTENT_PADDING_BOTTOM = 4

export class ItemGrid extends Component {
    state = {
        expandedItems: {},
        //adding for grid
        currentBreakpoint: "lg",
        compactType: "vertical",
        mounted: false,
        //layouts: { lg: this.props.initialLayout }
        //layouts: { lg: generateLayout(this.props.dashboardItems) }
        layouts: { lg: this.props.dashboardItems }
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

    onBreakpointChange = (breakpoint) => {
        this.setState({
            currentBreakpoint: breakpoint
        })
    }

    onLayoutChange = (layout, layouts) => {
        this.props.onLayoutChange(layout, layouts);
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
                >
                    {/*{this.generateDOM()}*/}
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
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    //initialLayout: generateLayout()
    //initialLayout: generateLayout(this.props.dashboardItems)
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
