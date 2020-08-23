import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import TitleBar from '../TitleBar/TitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
import FilterBar from '../FilterBar/FilterBar'
import DashboardsBar from '../ControlBar/DashboardsBar'
import DashboardVerticalOffset from './DashboardVerticalOffset'
import { sGetIsEditing } from '../../reducers/editDashboard'
import { sGetIsPrinting } from '../../reducers/printDashboard'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { acClearPrintDashboard } from '../../actions/printDashboard'

export const ViewDashboard = props => {
    useEffect(() => {
        if (props.dashboardIsEditing) {
            props.clearEditDashboard()
        } else if (props.dashboardIsPrinting) {
            props.clearPrintDashboard()
        }
    }, [props.dashboardIsEditing, props.dashboardIsPrinting])

    return (
        <>
            <DashboardsBar />
            <DashboardVerticalOffset />
            <div className="dashboard-wrapper">
                <TitleBar edit={false} />
                <FilterBar />
                <ItemGrid edit={false} />
            </div>
        </>
    )
}

ViewDashboard.propTypes = {
    clearEditDashboard: PropTypes.func,
    clearPrintDashboard: PropTypes.func,
    dashboardIsEditing: PropTypes.bool,
    dashboardIsPrinting: PropTypes.bool,
}

const mapStateToProps = state => {
    return {
        dashboardIsEditing: sGetIsEditing(state),
        dashboardIsPrinting: sGetIsPrinting(state),
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
})(ViewDashboard)
