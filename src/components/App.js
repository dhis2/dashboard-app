import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { CssVariables } from '@dhis2/ui'

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

export class App extends Component {
    componentDidMount() {
        this.props.setCurrentUser(this.props.d2.currentUser)
        this.props.fetchDashboards()
        this.props.setControlBarRows()
        this.props.setShowDescription()
        this.props.setDimensions(this.props.d2)
        this.props.addSettings()
    }

    getChildContext() {
        return { baseUrl: this.props.baseUrl, i18n, d2: this.props.d2 }
    }

    render() {
        return (
            <>
                <CssVariables colors spacers />
                <Router>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={props => (
                                <Dashboard {...props} mode={VIEW} />
                            )}
                        />
                        <Route
                            exact
                            path="/new"
                            render={props => (
                                <Dashboard {...props} mode={NEW} />
                            )}
                        />
                        <Route
                            exact
                            path="/:dashboardId"
                            render={props => (
                                <Dashboard {...props} mode={VIEW} />
                            )}
                        />
                        <Route
                            exact
                            path="/:dashboardId/edit"
                            render={props => (
                                <Dashboard {...props} mode={EDIT} />
                            )}
                        />
                        <Route
                            exact
                            path="/:dashboardId/printoipp"
                            render={props => (
                                <Dashboard {...props} mode={PRINT} />
                            )}
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
                <AlertBar />
            </>
        )
    }
}

App.propTypes = {
    addSettings: PropTypes.func.isRequired,
    fetchDashboards: PropTypes.func.isRequired,
    setControlBarRows: PropTypes.func.isRequired,
    setCurrentUser: PropTypes.func.isRequired,
    setDimensions: PropTypes.func.isRequired,
    setShowDescription: PropTypes.func.isRequired,
    baseUrl: PropTypes.string,
    d2: PropTypes.object,
}

App.childContextTypes = {
    baseUrl: PropTypes.string,
    i18n: PropTypes.object,
    d2: PropTypes.object,
}

const mapDispatchToProps = dispatch => {
    return {
        fetchDashboards: () => dispatch(tFetchDashboards()),
        setControlBarRows: () => dispatch(tSetControlBarRows()),
        setCurrentUser: currentUser => dispatch(acReceivedUser(currentUser)),
        setDimensions: d2 => dispatch(tSetDimensions(d2)),
        setShowDescription: () => dispatch(tSetShowDescription()),
        addSettings: () => dispatch(tAddSettings()),
    }
}

export default connect(null, mapDispatchToProps)(App)
