import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ReactGridLayout from 'react-grid-layout'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import cx from 'classnames'

import { acUpdateDashboardLayout } from '../../actions/editDashboard'
import { Item } from '../Item/Item'
import { resize as pluginResize } from '../Item/VisualizationItem/Visualization/plugin'
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
import { sGetSelectedId, sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'
import ProgressiveLoadingContainer from '../Item/ProgressiveLoadingContainer'
import { VIEW, EDIT } from '../Dashboard/dashboardModes'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './styles/ItemGrid.css'

// Component

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

    getItemComponent = item => (
        <ProgressiveLoadingContainer
            key={item.i}
            className={cx(item.type, 'edit')}
            itemId={item.id}
        >
            <Item item={item} dashboardMode={EDIT} />
        </ProgressiveLoadingContainer>
    )

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
                    layout={items}
                    margin={MARGIN}
                    cols={getGridColumns()}
                    rowHeight={GRID_ROW_HEIGHT}
                    width={window.innerWidth}
                    compactType={GRID_COMPACT_TYPE}
                    onLayoutChange={this.onLayoutChange}
                    onResizeStop={this.onResizeStop}
                    isDraggable={true}
                    isResizable={true}
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

const mergeProps = (stateProps, dispatchProps) => {
    const validItems = orArray(stateProps.dashboardItems).filter(hasShape)

    return {
        ...dispatchProps,
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
