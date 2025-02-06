import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Item } from '../../components/Item/Item.jsx'
import { PRINT } from '../../modules/dashboardModes.js'
import { getFirstOfTypes } from '../../modules/getFirstOfType.js'
import { getGridItemDomElementClassName } from '../../modules/getGridItemDomElementClassName.js'
import { hasShape } from '../../modules/gridUtil.js'
import { orArray } from '../../modules/util.js'
import { sGetPrintDashboardItems } from '../../reducers/printDashboard.js'
import StaticGrid from './StaticGrid.jsx'

const PrintItemGrid = ({ dashboardItems }) => {
    const firstOfTypes = getFirstOfTypes(dashboardItems)

    const getItemComponent = (item) => {
        if (firstOfTypes.includes(item.id)) {
            item.firstOfType = true
        }
        return (
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
    }

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
