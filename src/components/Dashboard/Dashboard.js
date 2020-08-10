import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { tSelectDashboard } from '../../actions/dashboards'
import { sDashboardsIsFetching } from '../../reducers/dashboards'
import {
    EDIT,
    NEW,
    VIEW,
    PRINT,
    PRINT_LAYOUT,
    isPrintMode,
} from './dashboardModes'
import ViewDashboard from './ViewDashboard'
import EditDashboard from './EditDashboard'
import NewDashboard from './NewDashboard'
import PrintDashboard from './PrintDashboard'
import PrintLayoutDashboard from './PrintLayoutDashboard'

const dashboardMap = {
    [VIEW]: ViewDashboard,
    [EDIT]: EditDashboard,
    [NEW]: NewDashboard,
    [PRINT]: PrintDashboard,
    [PRINT_LAYOUT]: PrintLayoutDashboard,
}

class Dashboard extends Component {
    setDashboard = () => {
        if (this.props.dashboardsLoaded) {
            const id = this.props.match.params.dashboardId || null

            this.props.selectDashboard(id)

            const header = document.getElementsByTagName('header')[0]
            if (isPrintMode(this.props.mode)) {
                header.classList.add('printMode')
            } else {
                header.classList.remove('printMode')
            }

            this.scrollToTop()
        }
    }

    scrollToTop = () => {
        window.scrollTo(0, 0)
    }

    componentDidMount() {
        this.setDashboard()
    }

    componentDidUpdate() {
        this.setDashboard()
    }

    render() {
        const ActiveDashboard = dashboardMap[this.props.mode]

        return <ActiveDashboard />
    }
}

Dashboard.propTypes = {
    dashboardsLoaded: PropTypes.bool,
    match: PropTypes.object,
    mode: PropTypes.string,
    selectDashboard: PropTypes.func,
}

const mapStateToProps = state => {
    return { dashboardsLoaded: !sDashboardsIsFetching(state) }
}

export default connect(mapStateToProps, {
    selectDashboard: tSelectDashboard,
})(Dashboard)
