import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import SnackbarMessage from './SnackbarMessage';
import { fromUser, fromDashboards, fromControlBar } from './actions';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class App extends Component {
    componentDidMount() {
        const { store, d2 } = this.context;
        store.dispatch(fromUser.acReceivedUser(d2.currentUser));
        store.dispatch(fromDashboards.tFetchDashboards());
        store.dispatch(fromControlBar.tSetControlBarRows());
    }

    getChildContext() {
        return {
            baseUrl: this.props.baseUrl,
            i18n,
        };
    }

    render() {
        return (
            <div className="app-wrapper">
                <HeaderBar />
                <Router>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            component={props => (
                                <Dashboard {...props} mode="view" />
                            )}
                        />
                        <Route
                            exact
                            path="/new"
                            component={props => (
                                <Dashboard {...props} mode="new" />
                            )}
                        />
                        <Route
                            exact
                            path="/:dashboardId"
                            component={props => (
                                <Dashboard {...props} mode="view" />
                            )}
                        />
                        <Route
                            exact
                            path="/:dashboardId/edit"
                            component={props => (
                                <Dashboard {...props} mode="edit" />
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
    d2: PropTypes.object,
    store: PropTypes.object,
};

App.childContextTypes = {
    baseUrl: PropTypes.string,
    i18n: PropTypes.object,
};

export default App;
