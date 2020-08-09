import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { CssVariables } from '@dhis2/ui'

import { EDIT, VIEW, NEW, PRINT } from './Dashboard/dashboardModes'
import { acReceivedUser } from '../actions/user'
import { tFetchDashboards } from '../actions/dashboards'
import { tSetControlBarRows } from '../actions/controlBar'
import { tSetDimensions } from '../actions/dimensions'
import Dashboard from './Dashboard/Dashboard'
import SnackbarMessage from './SnackbarMessage/SnackbarMessage'

import './App.css'

export class App extends Component {
    componentDidMount() {
        this.props.setCurrentUser(this.props.d2.currentUser)
        this.props.fetchDashboards()
        this.props.setControlBarRows()
        this.props.setDimensions(this.props.d2)
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
                    </Switch>
                </Router>
                <SnackbarMessage />
            </>
        )
    }
}

App.propTypes = {
    fetchDashboards: PropTypes.func.isRequired,
    setControlBarRows: PropTypes.func.isRequired,
    setCurrentUser: PropTypes.func.isRequired,
    setDimensions: PropTypes.func.isRequired,
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
        setCurrentUser: currentUser => dispatch(acReceivedUser(currentUser)),
        fetchDashboards: () => dispatch(tFetchDashboards()),
        setControlBarRows: () => dispatch(tSetControlBarRows()),
        setDimensions: d2 => dispatch(tSetDimensions(d2)),
    }
}

export default connect(null, mapDispatchToProps)(App)
