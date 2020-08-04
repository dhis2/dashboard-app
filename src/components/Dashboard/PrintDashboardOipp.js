import React, { useEffect } from 'react'
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
import PrintOippItemGrid from '../ItemGrid/PrintOippItemGrid'

const PrintOneItemPerPage = props => {
    useEffect(() => {
        // console.log('jj initPrintDashboard items', props.items)
        if (props.dashboard) {
            props.setEditDashboard(props.dashboard, props.items)
        }
    }, [props.dashboard])

    const contentNotReady = !props.dashboardsLoaded || props.id === null

    return (
        <div className="dashboard-wrapper">
            {contentNotReady ? null : (
                <>
                    <PrintTitleBar />
                    <PrintOippItemGrid />
                </>
            )}
        </div>
    )
}

PrintOneItemPerPage.propTypes = {
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
})(PrintOneItemPerPage)
