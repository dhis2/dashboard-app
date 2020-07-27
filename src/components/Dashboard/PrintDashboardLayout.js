import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
    acSetEditDashboard,
    acAddDashboardItem,
} from '../../actions/editDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
    sDashboardsIsFetching,
} from '../../reducers/dashboards'
import PrintTitleBar from '../TitleBar/PrintTitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
// import { getGridYFromPixels } from '../../modules/gridUtil'
import { getNumPrintPages } from '../../modules/printUtils'
import { PAGEBREAK } from '../../modules/itemTypes'

const addPageBreaks = ({ items, addDashboardItem }) => {
    // TODO: this is not accurate bc adding the static page
    // breaks can increase the number of actual pages
    const pageCount = getNumPrintPages(items) + 1
    const yList = [33, 72, 110, 149, 187, 226, 264]
    for (let i = 0; i < pageCount; ++i) {
        addDashboardItem({ type: PAGEBREAK, yPos: yList[i] })
    }

    return items
}

const PrintDashboardLayout = props => {
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        if (props.dashboard) {
            setInitialized(true)
            props.setEditDashboard(props.dashboard, props.items)
            if (props.items.length > 0) {
                addPageBreaks(props)
            }
        }
    }, [props.dashboard, props.items, initialized])

    const contentNotReady = !props.dashboardsLoaded || props.id === null

    return (
        <div className="dashboard-wrapper">
            {contentNotReady ? null : (
                <>
                    <PrintTitleBar />
                    <ItemGrid />
                </>
            )}
        </div>
    )
}

PrintDashboardLayout.propTypes = {
    dashboard: PropTypes.object,
    dashboardsLoaded: PropTypes.bool,
    id: PropTypes.string,
    items: PropTypes.array,
    setEditDashboard: PropTypes.func,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = id ? sGetDashboardById(state, id) : null

    return {
        dashboard,
        id,
        items: sGetDashboardItems(state),
        dashboardsLoaded: !sDashboardsIsFetching(state),
    }
}

export default connect(mapStateToProps, {
    setEditDashboard: acSetEditDashboard,
    addDashboardItem: acAddDashboardItem,
})(PrintDashboardLayout)
