import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import Snackbar from 'material-ui/Snackbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Dashboard from './Dashboard/Dashboard';
import SnackbarMessage from './SnackbarMessage';

import { fromUser, fromDashboards } from './actions';
import { acCloseSnackbar } from './actions/snackbar';
import { fromSnackbar } from './reducers';
import { sDashboardsIsFetching } from './reducers/dashboards';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// App
class App extends Component {
    componentWillMount() {
        console.log('App CWM');

        const { store, d2 } = this.context;
        store.dispatch(fromUser.acReceivedUser(d2.currentUser));
    }

    getChildContext() {
        return {
            baseUrl: this.props.baseUrl,
            i18n,
        };
    }

    onCloseSnackbar = () => {
        this.props.acCloseSnackbar();
    };

    render() {
        console.log('App render route', this.props);

        return (
            <div className="app-wrapper">
                <HeaderBar />
                <Router>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            component={props => (
                                <Dashboard
                                    {...props}
                                    mode="view"
                                    baseUrl={this.props.baseUrl}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/new"
                            component={props => (
                                <Dashboard
                                    {...props}
                                    mode="new"
                                    baseUrl={this.props.baseUrl}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/view/:dashboardId"
                            component={props => (
                                <Dashboard
                                    {...props}
                                    mode="view"
                                    baseUrl={this.props.baseUrl}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/edit/:dashboardId"
                            component={props => (
                                <Dashboard
                                    {...props}
                                    mode="edit"
                                    baseUrl={this.props.baseUrl}
                                />
                            )}
                        />
                    </Switch>
                </Router>
                <Snackbar
                    open={this.props.snackbarOpen}
                    message={
                        <SnackbarMessage message={this.props.snackbarMessage} />
                    }
                    autoHideDuration={this.props.snackbarDuration}
                    onRequestClose={this.props.onCloseSnackbar}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { message, duration, open } = fromSnackbar.sGetSnackbar(state);
    const dashboardsIsFetching = sDashboardsIsFetching(state);

    return {
        snackbarOpen: open,
        snackbarMessage: message,
        snackbarDuration: duration,
        dashboardsIsFetching,
    };
};

App.contextTypes = {
    d2: PropTypes.object,
    store: PropTypes.object,
};

App.childContextTypes = {
    baseUrl: PropTypes.string,
    i18n: PropTypes.object,
};

export default connect(mapStateToProps, {
    acCloseSnackbar,
})(App);
