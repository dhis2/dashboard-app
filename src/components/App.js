import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';
import HeaderBar from 'ui/widgets/HeaderBar';

import { fromUser, fromDashboards, fromControlBar } from '../actions';
import Dashboard from './Dashboard/Dashboard';
import SnackbarMessage from './SnackbarMessage/SnackbarMessage';
import { EDIT, VIEW, NEW } from './Dashboard/dashboardModes';

import './App.css';

class App extends Component {
    componentDidMount() {
        const { store } = this.context;
        store.dispatch(fromUser.acReceivedUser(this.props.d2.currentUser));
        store.dispatch(fromDashboards.tFetchDashboards());
        store.dispatch(fromControlBar.tSetControlBarRows());
    }

    getChildContext() {
        return { baseUrl: this.props.baseUrl, i18n, d2: this.props.d2 };
    }

    render() {
        return (
            <div className="app-wrapper">
                <div className="dashboard-header-bar">
                    <HeaderBar appName={i18n.t('Dashboard')} />
                </div>
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
                    </Switch>
                </Router>
                <SnackbarMessage />
            </div>
        );
    }
}

App.contextTypes = {
    store: PropTypes.object,
};

App.childContextTypes = {
    baseUrl: PropTypes.string,
    i18n: PropTypes.object,
    d2: PropTypes.object,
};

export default App;
