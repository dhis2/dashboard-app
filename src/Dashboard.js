import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import i18n from '@dhis2/d2-i18n'
import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import { Redirect } from 'react-router-dom'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'

import DashboardsBar from './pages/view/DashboardsBar/DashboardsBar'
import NoContentMessage from './components/NoContentMessage'
import ViewDashboard from './pages/view/ViewDashboard'
import EditDashboard from './pages/edit/EditDashboard'
import NewDashboard from './pages/edit/NewDashboard'
import PrintDashboard from './pages/print/PrintDashboard'
import PrintLayoutDashboard from './pages/print/PrintLayoutDashboard'

import { tSelectDashboard } from './actions/dashboards'
import { acClearEditDashboard } from './actions/editDashboard'
import { sDashboardsIsFetching, sGetAllDashboards } from './reducers/dashboards'
import { sGetSelectedId, NON_EXISTING_DASHBOARD_ID } from './reducers/selected'
import {
    EDIT,
    NEW,
    VIEW,
    PRINT,
    PRINT_LAYOUT,
    isPrintMode,
    isEditMode,
} from './modules/dashboardModes'

import { useWindowDimensions } from './components/WindowDimensionsProvider'
import { isSmallScreen } from './modules/smallScreen'

const setHeaderbarVisibility = mode => {
    const header = document.getElementsByTagName('header')[0]
    if (isPrintMode(mode)) {
        header.classList.add('hidden')
    } else {
        header.classList.remove('hidden')
    }
}

const dashboardMap = {
    [VIEW]: <ViewDashboard />,
    [EDIT]: <EditDashboard />,
    [NEW]: <NewDashboard />,
    [PRINT]: <PrintDashboard />,
    [PRINT_LAYOUT]: <PrintLayoutDashboard />,
}

const Dashboard = ({
    id,
    mode,
    dashboardsLoaded,
    dashboardsIsEmpty,
    routeId,
    selectDashboard,
    clearEditDashboard,
}) => {
    const { width } = useWindowDimensions()
    const [redirectUrl, setRedirectUrl] = useState(null)
    const { d2 } = useD2()
    const username = d2.currentUser.username

    useEffect(() => {
        setHeaderbarVisibility(mode)
    }, [mode])

    useEffect(() => {
        if (isSmallScreen(width) && isEditMode(mode)) {
            const redirectUrl = routeId ? `/${routeId}` : '/'
            setRedirectUrl(redirectUrl)
        } else {
            setRedirectUrl(null)
        }
    }, [mode])

    useEffect(() => {
        if (!isEditMode(mode)) {
            clearEditDashboard()
        }
    }, [mode])

    useEffect(() => {
        if (dashboardsLoaded && !dashboardsIsEmpty && mode !== NEW) {
            selectDashboard(routeId, mode, username)
        }
    }, [dashboardsLoaded, dashboardsIsEmpty, routeId, mode])

    if (!dashboardsLoaded) {
        return (
            <Layer translucent>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </Layer>
        )
    }

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    if (mode === NEW) {
        return dashboardMap[mode]
    }

    if (dashboardsIsEmpty) {
        return (
            <>
                <DashboardsBar />
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
                <NoContentMessage
                    text={i18n.t('Requested dashboard not found')}
                />
            </>
        )
    }

    if (id === null) {
        return (
            <Layer translucent>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </Layer>
        )
    }

    return dashboardMap[mode]
}

Dashboard.propTypes = {
    dashboardsIsEmpty: PropTypes.bool,
    dashboardsLoaded: PropTypes.bool,
    id: PropTypes.string,
    match: PropTypes.object, // provided by the react-router-dom
    mode: PropTypes.string,
    routeId: PropTypes.string,
    selectDashboard: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
    const dashboards = sGetAllDashboards(state)
    return {
        dashboardsIsEmpty: isEmpty(dashboards),
        dashboardsLoaded: !sDashboardsIsFetching(state),
        id: sGetSelectedId(state),
        routeId: ownProps.match?.params?.dashboardId || null,
    }
}

export default connect(mapStateToProps, {
    selectDashboard: tSelectDashboard,
    clearEditDashboard: acClearEditDashboard,
})(Dashboard)
