import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ItemGrid from './ItemGrid'
import { Item } from '../Item/Item'

import { acUpdateDashboardLayout } from '../../actions/editDashboard'
import { resize as pluginResize } from '../Item/VisualizationItem/plugin'
import { isVisualizationType } from '../../modules/itemTypes'
import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'
import { orArray } from '../../modules/util'
import { hasShape, onItemResize } from '../../modules/gridUtil'
import { a4LandscapeWidthPx } from '../../modules/printUtils'

export const PrintLayoutItemGrid = ({
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
            <div key={item.i} className={itemClassNames}>
                <Item item={item} />
            </div>
        )
    }

    const getItemComponents = items => items.map(item => getItemComponent(item))

    const width =
        a4LandscapeWidthPx < window.innerWidth
            ? a4LandscapeWidthPx
            : window.innerWidth

    return (
        <ItemGrid
            onLayoutChange={onLayoutChange}
            onResizeStop={onResizeStop}
            classNames="print layout"
            layout={dashboardItems}
            width={width}
            isEditable={true}
            isLoading={isLoading}
        >
            {getItemComponents(dashboardItems)}
        </ItemGrid>
    )
}

PrintLayoutItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
    updateDashboardLayout: PropTypes.func,
}

PrintLayoutItemGrid.defaultProps = {
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
})(PrintLayoutItemGrid)
