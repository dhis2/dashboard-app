import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CssVariables } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect, HashRouter as Router, Route, Switch } from 'react-router-dom'
import { acClearActiveModalDimension } from '../actions/activeModalDimension'
import { tSetControlBarRows } from '../actions/controlBar'
import { tFetchDashboards } from '../actions/dashboards'
import { acClearDashboardsFilter } from '../actions/dashboardsFilter'
import { acClearEditDashboard } from '../actions/editDashboard'
import { acClearItemActiveTypes } from '../actions/itemActiveTypes'
import { acClearItemFilters } from '../actions/itemFilters'
import { acClearPrintDashboard } from '../actions/printDashboard'
import { acSetSelected } from '../actions/selected'
import { tSetShowDescription } from '../actions/showDescription'
import { acClearVisualizations } from '../actions/visualizations'
import { NewDashboard, EditDashboard } from '../pages/edit'
import { PrintDashboard, PrintLayoutDashboard } from '../pages/print'
import { LandingPage, ROUTE_START_PATH } from '../pages/start'
import { ViewDashboard } from '../pages/view'
import { useSystemSettings } from './SystemSettingsProvider'
import './styles/App.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './styles/ItemGrid.css'

const App = (props) => {
    const { d2 } = useD2()
    const { systemSettings } = useSystemSettings()

    useEffect(() => {
        props.fetchDashboards()
        props.setControlBarRows()
        props.setShowDescription()

        // store the headerbar height for controlbar height calculations
        const headerbarHeight = document
            .querySelector('header')
            .getBoundingClientRect().height

        document.documentElement.style.setProperty(
            '--headerbar-height',
            `${headerbarHeight}px`
        )
    }, [])

    return (
        systemSettings && (
            <>
                <CssVariables colors spacers />
                <Router>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={(props) =>
                                systemSettings.startModuleEnableLightweight ? (
                                    <Redirect to={ROUTE_START_PATH} />
                                ) : (
                                    <ViewDashboard
                                        {...props}
                                        username={d2.currentUser.username}
                                    />
                                )
                            }
                        />
                        <Route
                            exact
                            path={ROUTE_START_PATH}
                            render={() => (
                                <LandingPage
                                    username={d2.currentUser.username}
                                    onMount={props.resetState}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/new"
                            render={(props) => <NewDashboard {...props} />}
                        />
                        <Route
                            exact
                            path="/:dashboardId"
                            render={(props) => (
                                <ViewDashboard
                                    {...props}
                                    username={d2.currentUser.username}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/:dashboardId/edit"
                            render={(props) => <EditDashboard {...props} />}
                        />
                        <Route
                            exact
                            path="/:dashboardId/printoipp"
                            render={(props) => <PrintDashboard {...props} />}
                        />
                        <Route
                            exact
                            path="/:dashboardId/printlayout"
                            render={(props) => (
                                <PrintLayoutDashboard {...props} />
                            )}
                        />
                    </Switch>
                </Router>
            </>
        )
    )
}

App.propTypes = {
    fetchDashboards: PropTypes.func,
    resetState: PropTypes.func,
    setControlBarRows: PropTypes.func,
    setShowDescription: PropTypes.func,
}

const mapDispatchToProps = {
    fetchDashboards: tFetchDashboards,
    setControlBarRows: tSetControlBarRows,
    setShowDescription: tSetShowDescription,
    resetState: () => (dispatch) => {
        dispatch(acSetSelected({}))
        dispatch(acClearDashboardsFilter())
        dispatch(acClearVisualizations())
        dispatch(acClearEditDashboard())
        dispatch(acClearPrintDashboard())
        dispatch(acClearItemFilters())
        dispatch(acClearActiveModalDimension())
        dispatch(acClearItemActiveTypes())
    },
}

export default connect(null, mapDispatchToProps)(App)
