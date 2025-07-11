import { CssVariables } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect, HashRouter as Router, Route, Switch } from 'react-router-dom'
import { acClearActiveModalDimension } from '../actions/activeModalDimension.js'
import { tFetchDashboards } from '../actions/dashboards.js'
import { acClearDashboardsFilter } from '../actions/dashboardsFilter.js'
import { acClearEditDashboard } from '../actions/editDashboard.js'
import { acClearItemActiveTypes } from '../actions/itemActiveTypes.js'
import { acClearItemFilters } from '../actions/itemFilters.js'
import { acClearPrintDashboard } from '../actions/printDashboard.js'
import { acSetSelected } from '../actions/selected.js'
import { tSetShowDescription } from '../actions/showDescription.js'
import { acClearVisualizations } from '../actions/visualizations.js'
import { NewDashboard, EditDashboard } from '../pages/edit/index.js'
import { PrintDashboard, PrintLayoutDashboard } from '../pages/print/index.js'
import { LandingPage, ROUTE_START_PATH } from '../pages/start/index.js'
import { ViewDashboard } from '../pages/view/index.js'
import {
    useCurrentUser,
    useSystemSettings,
} from './AppDataProvider/AppDataProvider.jsx'
import './styles/App.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './styles/ItemGrid.css'

const App = ({ fetchDashboards, setShowDescription, resetState }) => {
    const systemSettings = useSystemSettings()
    const currentUser = useCurrentUser()

    useEffect(() => {
        fetchDashboards()
        setShowDescription()
    }, [fetchDashboards, setShowDescription])

    return (
        systemSettings && (
            <>
                <CssVariables colors spacers elevations theme />
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
                                        username={currentUser.username}
                                    />
                                )
                            }
                        />
                        <Route
                            exact
                            path={ROUTE_START_PATH}
                            render={() => (
                                <LandingPage
                                    username={currentUser.username}
                                    onMount={resetState}
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
                                    username={currentUser.username}
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
    setShowDescription: PropTypes.func,
}

const mapDispatchToProps = {
    fetchDashboards: tFetchDashboards,
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
