import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import i18n from '@dhis2/d2-i18n'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'

import DashboardsBar from '../ControlBar/DashboardsBar'
import DashboardVerticalOffset from './DashboardVerticalOffset'
import NoContentMessage from '../../widgets/NoContentMessage'
import ViewDashboard from './ViewDashboard'
import EditDashboard from './EditDashboard'
import NewDashboard from './NewDashboard'
import PrintDashboard from './PrintDashboard'
import PrintLayoutDashboard from './PrintLayoutDashboard'

import { tSelectDashboard } from '../../actions/dashboards'
import {
    sDashboardsIsFetching,
    sGetAllDashboards,
} from '../../reducers/dashboards'
import {
    sGetSelectedId,
    NON_EXISTING_DASHBOARD_ID,
} from '../../reducers/selected'
import {
    EDIT,
    NEW,
    VIEW,
    PRINT,
    PRINT_LAYOUT,
    isPrintMode,
} from './dashboardModes'

const dashboardMap = {
    [VIEW]: <ViewDashboard />,
    [EDIT]: <EditDashboard />,
    [NEW]: <NewDashboard />,
    [PRINT]: <PrintDashboard />,
    [PRINT_LAYOUT]: <PrintLayoutDashboard />,
}

export class Dashboard extends Component {
    setDashboard = () => {
        if (this.props.dashboardsLoaded) {
            const id = this.props.match.params.dashboardId || null || null

            this.props.selectDashboard(id)

            this.setHeaderbarVisibility()

            this.scrollToTop()
        }
    }

    setHeaderbarVisibility = () => {
        const header = document.getElementsByTagName('header')[0]
        if (isPrintMode(this.props.mode)) {
            header.classList.add('hidden')
        } else {
            header.classList.remove('hidden')
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
        const { id, mode, dashboardsLoaded, dashboardsIsEmpty } = this.props

        if (!dashboardsLoaded || id === null) {
            return (
                <Layer translucent>
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                </Layer>
            )
        }

        if (mode === NEW) {
            return dashboardMap[mode]
        }

        if (dashboardsIsEmpty) {
            return (
                <>
                    <DashboardsBar />
                    <DashboardVerticalOffset />
                    <NoContentMessage
                        text={i18n.t(
                            'No dashboards found. Use the + button to create a new dashboard.'
                        )}
                    />
                </>
            )
        }

        if (id === NON_EXISTING_DASHBOARD_ID) {
            return (
                <>
                    <DashboardsBar />
                    <DashboardVerticalOffset />
                    <NoContentMessage
                        text={i18n.t('Requested dashboard not found')}
                    />
                </>
            )
        }

        return dashboardMap[mode]
    }
}

Dashboard.propTypes = {
    dashboardsIsEmpty: PropTypes.bool,
    dashboardsLoaded: PropTypes.bool,
    id: PropTypes.string,
    match: PropTypes.object,
    mode: PropTypes.string,
    selectDashboard: PropTypes.func,
}

const mapStateToProps = state => {
    const dashboards = sGetAllDashboards(state)
    return {
        dashboardsIsEmpty: isEmpty(dashboards),
        dashboardsLoaded: !sDashboardsIsFetching(state),
        id: sGetSelectedId(state),
    }
}

export default connect(mapStateToProps, {
    selectDashboard: tSelectDashboard,
})(Dashboard)
