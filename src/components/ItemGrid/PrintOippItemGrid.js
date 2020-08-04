import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ItemGrid from './ItemGrid'
import { Item } from '../Item/Item'

import {
    hasShape,
    getItemPageColumns,
    getItemPageHeightRows,
} from '../../modules/gridUtil'
import {
    sortItemsByYPosition,
    a4LandscapeWidthPx,
} from '../../modules/printUtils'
import { orArray } from '../../modules/util'
import { sGetSelectedIsLoading } from '../../reducers/selected'
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard'

export const PrintOippItemGrid = ({ isLoading, dashboardItems }) => {
    const getItemComponent = item => {
        const itemClassNames = item.type

        item.w = getItemPageColumns(1102)
        item.h = getItemPageHeightRows(700)

        return (
            <div key={item.i} className={itemClassNames} forceLoad={true}>
                <Item item={item} />
            </div>
        )
    }

    const getItemComponents = items => items.map(item => getItemComponent(item))

    const width =
        a4LandscapeWidthPx < window.innerWidth
            ? a4LandscapeWidthPx
            : window.innerWidth

    sortItemsByYPosition(dashboardItems)

    return (
        <ItemGrid
            classNames="layout print printoipp"
            layout={dashboardItems}
            width={width}
            isEditable={false}
            isLoading={isLoading}
        >
            {getItemComponents(dashboardItems)}
        </ItemGrid>
    )
}

PrintOippItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
    isLoading: PropTypes.bool,
}

const mapStateToProps = state => {
    const dashboard = sGetEditDashboardRoot(state)

    return {
        isLoading: sGetSelectedIsLoading(state) || !dashboard,
        dashboardItems: orArray(sGetEditDashboardItems(state)).filter(hasShape),
    }
}

export default connect(mapStateToProps)(PrintOippItemGrid)
