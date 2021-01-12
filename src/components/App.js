import React, { useEffect } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CssVariables } from '@dhis2/ui'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'

import Dashboard from './Dashboard/Dashboard'
import AlertBar from './AlertBar/AlertBar'

import { acReceivedUser } from '../actions/user'
import { tFetchDashboards } from '../actions/dashboards'
import { tSetControlBarRows } from '../actions/controlBar'
import { tSetShowDescription } from '../actions/selected'
import { tSetDimensions } from '../actions/dimensions'
import { tAddSettings } from '../actions/settings'

import {
    EDIT,
    VIEW,
    NEW,
    PRINT,
    PRINT_LAYOUT,
} from './Dashboard/dashboardModes'

import './App.css'

const App = props => {
    const { d2 } = useD2({})

    useEffect(() => {
        props.setCurrentUser(d2.currentUser)
        props.fetchDashboards()
        props.setControlBarRows()
        props.setShowDescription()
        props.setDimensions()
        props.addSettings()
    }, [])

    return (
        <>
            <CssVariables colors spacers />
            <Router>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => <Dashboard mode={VIEW} />}
                    />
                    <Route
                        exact
                        path="/new"
                        render={() => <Dashboard mode={NEW} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId"
                        render={() => <Dashboard mode={VIEW} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId/edit"
                        render={() => <Dashboard mode={EDIT} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId/printoipp"
                        render={() => <Dashboard mode={PRINT} />}
                    />
                    <Route
                        exact
                        path="/:dashboardId/printlayout"
                        render={() => <Dashboard mode={PRINT_LAYOUT} />}
                    />
                </Switch>
            </Router>
            <AlertBar />
        </>
    )
}

App.propTypes = {
    addSettings: PropTypes.func.isRequired,
    fetchDashboards: PropTypes.func.isRequired,
    setControlBarRows: PropTypes.func.isRequired,
    setCurrentUser: PropTypes.func.isRequired,
    setDimensions: PropTypes.func.isRequired,
    setShowDescription: PropTypes.func.isRequired,
}

const mapDispatchToProps = {
    fetchDashboards: tFetchDashboards,
    setControlBarRows: tSetControlBarRows,
    setCurrentUser: acReceivedUser,
    setDimensions: tSetDimensions,
    setShowDescription: tSetShowDescription,
    addSettings: tAddSettings,
}

export default connect(null, mapDispatchToProps)(App)
