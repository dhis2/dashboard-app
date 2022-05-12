import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Item } from '../../components/Item/Item'
import { PRINT } from '../../modules/dashboardModes'
import { getGridItemDomElementClassName } from '../../modules/getGridItemDomElementClassName'
import { hasShape } from '../../modules/gridUtil'
import { orArray } from '../../modules/util'
import { sGetPrintDashboardItems } from '../../reducers/printDashboard'
import StaticGrid from './StaticGrid'

const PrintItemGrid = ({ dashboardItems }) => {
    const getItemComponent = (item) => (
        <div
            key={item.i}
            className={cx(
                item.type,
                'print',
                'oipp',
                getGridItemDomElementClassName(item.id)
            )}
        >
            <Item item={item} dashboardMode={PRINT} />
        </div>
    )

    const getItemComponents = (items) =>
        items.map((item) => getItemComponent(item))

    return (
        <StaticGrid className="print" layout={dashboardItems}>
            {getItemComponents(dashboardItems)}
        </StaticGrid>
    )
}

PrintItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
}

const mapStateToProps = (state) => {
    return {
        dashboardItems: orArray(sGetPrintDashboardItems(state)).filter(
            hasShape
        ),
    }
}

export default connect(mapStateToProps)(PrintItemGrid)
