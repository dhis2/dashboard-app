import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ItemGrid from './ItemGrid'
import ProgressiveLoadingContainer from '../Item/ProgressiveLoadingContainer'
import { Item } from '../Item/Item'

import { sGetSelectedId, sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import { hasShape } from '../../modules/gridUtil'
import { orArray } from '../../modules/util'

const EXPANDED_HEIGHT = 17

export const ViewItemGrid = ({ isLoading, dashboardItems }) => {
    const [expandedItems, setExpandedItems] = useState({})

    const onToggleItemExpanded = clickedId => {
        const isExpanded =
            typeof expandedItems[clickedId] === 'boolean'
                ? expandedItems[clickedId]
                : false

        const newExpandedItems = { ...expandedItems }
        newExpandedItems[clickedId] = !isExpanded
        setExpandedItems({ ...newExpandedItems })
    }

    const adjustHeightForExpanded = dashboardItem => {
        const expandedItem = expandedItems[dashboardItem.id]

        if (expandedItem && expandedItem === true) {
            return Object.assign({}, dashboardItem, {
                h: dashboardItem.h + EXPANDED_HEIGHT,
            })
        }

        return dashboardItem
    }

    const getItemComponent = item => {
        const itemClassNames = [item.type, 'view'].join(' ')

        return (
            <ProgressiveLoadingContainer
                key={item.i}
                className={itemClassNames}
            >
                <Item item={item} onToggleItemExpanded={onToggleItemExpanded} />
            </ProgressiveLoadingContainer>
        )
    }

    const getItemComponents = items => items.map(item => getItemComponent(item))

    const items = dashboardItems.map(adjustHeightForExpanded)

    return (
        <ItemGrid
            classNames="layout"
            layout={items}
            width={window.innerWidth}
            isEditable={false}
            isLoading={isLoading}
        >
            {getItemComponents(items)}
        </ItemGrid>
    )
}

ViewItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
}

ViewItemGrid.defaultProps = {
    dashboardItems: [],
}

const mapStateToProps = state => {
    const dashboard = sGetDashboardById(state, sGetSelectedId(state))

    return {
        isLoading: sGetSelectedIsLoading(state) || !dashboard,
        dashboardItems: orArray(sGetDashboardItems(state)).filter(hasShape),
    }
}

export default connect(mapStateToProps)(ViewItemGrid)
