import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ItemGrid from './ItemGrid'
import ProgressiveLoadingContainer from '../Item/ProgressiveLoadingContainer'
import { Item } from '../Item/Item'

import { acUpdateDashboardLayout } from '../../actions/editDashboard'
import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'
import { resize as pluginResize } from '../Item/VisualizationItem/plugin'
import { isVisualizationType } from '../../modules/itemTypes'
import { hasShape, onItemResize } from '../../modules/gridUtil'
import { orArray } from '../../modules/util'

export const EditItemGrid = ({
    isLoading,
    dashboardItems,
    updateDashboardLayout,
}) => {
    const onLayoutChange = newLayout => {
        updateDashboardLayout(newLayout)
    }

    const onResizeStop = (layout, oldItem, newItem) => {
        onItemResize(newItem.i)

        const dashboardItem = dashboardItems.find(item => item.id === newItem.i)

        // call resize on the item component if it's a plugin type
        if (dashboardItem && isVisualizationType(dashboardItem)) {
            pluginResize(dashboardItem)
        }
    }

    const getItemComponent = item => {
        const itemClassNames = [item.type, 'edit'].join(' ')

        return (
            <ProgressiveLoadingContainer
                key={item.i}
                className={itemClassNames}
            >
                <Item item={item} />
            </ProgressiveLoadingContainer>
        )
    }

    const getItemComponents = items => items.map(item => getItemComponent(item))

    return (
        <ItemGrid
            onLayoutChange={onLayoutChange}
            onResizeStop={onResizeStop}
            classNames="layout"
            layout={dashboardItems}
            width={window.innerWidth}
            isEditable={true}
            isLoading={isLoading}
        >
            {getItemComponents(dashboardItems)}
        </ItemGrid>
    )
}

EditItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
    updateDashboardLayout: PropTypes.func,
}

EditItemGrid.defaultProps = {
    dashboardItems: [],
}

const mapStateToProps = state => {
    const dashboard = sGetEditDashboardRoot(state)

    return {
        isLoading: sGetSelectedIsLoading(state) || !dashboard,
        dashboardItems: orArray(sGetEditDashboardItems(state)).filter(hasShape),
    }
}

export default connect(mapStateToProps, {
    updateDashboardLayout: acUpdateDashboardLayout,
})(EditItemGrid)
