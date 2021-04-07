import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import i18n from '@dhis2/d2-i18n'
import {
    Layer,
    CenteredContent,
    CircularLoader,
    CssVariables,
    AlertStack,
    AlertBar,
} from '@dhis2/ui'
import { Redirect } from 'react-router-dom'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import NoContentMessage from './NoContentMessage'
import { ViewDashboard, DashboardsBar } from '../pages/view/'
import { EditDashboard, NewDashboard } from '../pages/edit/'
import { PrintDashboard, PrintLayoutDashboard } from '../pages/print/'

import { acClearEditDashboard } from '../actions/editDashboard'
import {
    tSetSelectedDashboardById,
    acSetSelectedIsLoading,
} from '../actions/selected'
import {
    sGetDashboardById,
    sDashboardsIsFetching,
    sGetAllDashboards,
} from '../reducers/dashboards'
import { sGetSelectedId, NON_EXISTING_DASHBOARD_ID } from '../reducers/selected'
import {
    EDIT,
    NEW,
    VIEW,
    PRINT,
    PRINT_LAYOUT,
    isPrintMode,
    isEditMode,
} from '../modules/dashboardModes'

import { useWindowDimensions } from './WindowDimensionsProvider'
import { isSmallScreen } from '../modules/smallScreen'

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
    name,
    mode,
    dashboardsLoaded,
    dashboardsIsEmpty,
    routeId,
    selectDashboard,
    clearEditDashboard,
    setIsLoading,
}) => {
    const { width } = useWindowDimensions()
    const [redirectUrl, setRedirectUrl] = useState(null)
    const [loadingMessage, setLoadingMessage] = useState(null)
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
        const prepareDashboard = async () => {
            setIsLoading(true)
            const alertTimeout = setTimeout(() => {
                if (name) {
                    setLoadingMessage(
                        i18n.t('Loading dashboard – {{name}}', { name })
                    )
                } else {
                    setLoadingMessage(i18n.t('Loading dashboard'))
                }
            }, 500)

            await selectDashboard(routeId, mode, username)

            setIsLoading(false)
            clearTimeout(alertTimeout)
            setLoadingMessage(null)
        }
        if (dashboardsLoaded && !dashboardsIsEmpty && mode !== NEW) {
            prepareDashboard()
        }
    }, [dashboardsLoaded, dashboardsIsEmpty, routeId, mode, name])

    const getContent = () => {
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

    return (
        <>
            <CssVariables colors spacers />
            {getContent()}
            <AlertStack>
                {loadingMessage && (
                    <AlertBar
                        onHidden={() => setLoadingMessage(null)}
                        permanent
                    >
                        {loadingMessage}
                    </AlertBar>
                )}
            </AlertStack>
        </>
    )
}

Dashboard.propTypes = {
    clearEditDashboard: PropTypes.func,
    dashboardsIsEmpty: PropTypes.bool,
    dashboardsLoaded: PropTypes.bool,
    id: PropTypes.string,
    mode: PropTypes.string,
    name: PropTypes.string,
    routeId: PropTypes.string,
    selectDashboard: PropTypes.func,
    setIsLoading: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
    const dashboards = sGetAllDashboards(state)
    // match is provided by the react-router-dom
    const routeId = ownProps.match?.params?.dashboardId || null

    return {
        dashboardsIsEmpty: isEmpty(dashboards),
        dashboardsLoaded: !sDashboardsIsFetching(state),
        id: sGetSelectedId(state),
        name: sGetDashboardById(state, routeId)?.displayName || null,
        routeId,
    }
}

export default connect(mapStateToProps, {
    selectDashboard: tSetSelectedDashboardById,
    clearEditDashboard: acClearEditDashboard,
    setIsLoading: acSetSelectedIsLoading,
})(Dashboard)
