import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'

import StaticGrid from './StaticGrid'
import { Item } from '../../components/Item/Item'

import { hasShape } from '../../modules/gridUtil'
import { PRINT } from '../../modules/dashboardModes'
import { sGetPrintDashboardItems } from '../../reducers/printDashboard'

import { orArray } from '../../modules/util'

const PrintItemGrid = ({ dashboardItems }) => {
    const getItemComponent = item => (
        <div key={item.i} className={cx(item.type, 'print', 'oipp')}>
            <Item item={item} dashboardMode={PRINT} />
        </div>
    )

    const getItemComponents = items => items.map(item => getItemComponent(item))

    return (
        <StaticGrid className="print" layout={dashboardItems}>
            {getItemComponents(dashboardItems)}
        </StaticGrid>
    )
}

PrintItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
}

const mapStateToProps = state => {
    return {
        dashboardItems: orArray(sGetPrintDashboardItems(state)).filter(
            hasShape
        ),
    }
}

export default connect(mapStateToProps)(PrintItemGrid)
