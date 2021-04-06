import React, { useEffect } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dashboard from './Dashboard'

import { tFetchDashboards } from './actions/dashboards'
import { tSetControlBarRows } from './actions/controlBar'
import { tSetShowDescription } from './actions/selected'

import { EDIT, VIEW, NEW, PRINT, PRINT_LAYOUT } from './modules/dashboardModes'

import './App.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './ItemGrid.css'

const App = props => {
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
        <Router>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={props => <Dashboard {...props} mode={VIEW} />}
                />
                <Route
                    exact
                    path="/new"
                    render={props => <Dashboard {...props} mode={NEW} />}
                />
                <Route
                    exact
                    path="/:dashboardId"
                    render={props => <Dashboard {...props} mode={VIEW} />}
                />
                <Route
                    exact
                    path="/:dashboardId/edit"
                    render={props => <Dashboard {...props} mode={EDIT} />}
                />
                <Route
                    exact
                    path="/:dashboardId/printoipp"
                    render={props => <Dashboard {...props} mode={PRINT} />}
                />
                <Route
                    exact
                    path="/:dashboardId/printlayout"
                    render={props => (
                        <Dashboard {...props} mode={PRINT_LAYOUT} />
                    )}
                />
            </Switch>
        </Router>
    )
}

App.propTypes = {
    fetchDashboards: PropTypes.func,
    setControlBarRows: PropTypes.func,
    setShowDescription: PropTypes.func,
}

const mapDispatchToProps = {
    fetchDashboards: tFetchDashboards,
    setControlBarRows: tSetControlBarRows,
    setShowDescription: tSetShowDescription,
}

export default connect(null, mapDispatchToProps)(App)
