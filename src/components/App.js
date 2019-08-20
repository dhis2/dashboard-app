import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import HeaderBar from '@dhis2/ui/widgets/HeaderBar';

import { EDIT, VIEW, NEW } from './Dashboard/dashboardModes';
import { acReceivedUser } from '../actions/user';
import { tFetchDashboards } from '../actions/dashboards';
import { tSetControlBarRows } from '../actions/controlBar';
import { tSetDimensions } from '../actions/dimensions';
import Dashboard from './Dashboard/Dashboard';
import SnackbarMessage from './SnackbarMessage/SnackbarMessage';

import 'typeface-roboto';
import './App.css';

export class App extends Component {
    componentDidMount() {
        this.props.setCurrentUser(this.props.d2.currentUser);
        this.props.fetchDashboards();
        this.props.setControlBarRows();
        this.props.setDimensions(this.props.d2);

        window.addEventListener('beforeprint', event => {
            if (
                window.confirm(`Print as single pages? ${window.innerHeight}`)
            ) {
                const appComponent = document.getElementsByClassName(
                    'app-wrapper'
                )[0];
                appComponent.classList.add('print-single-page');
                setTimeout(() => {}, 500);
            } else {
                const gridItems = document.getElementsByClassName(
                    'react-grid-item'
                );

                const finalItems = [].slice.call(gridItems);
                // console.log('gridItems', finalItems);

                const coords = finalItems.map((item, i) => {
                    return `${item.clientHeight} ${item.clientWidth}`;
                });

                console.log('coords', coords.join(', '));
            }
        });

        window.addEventListener('afterprint', event => {
            // alert('after print', event);
            const appComponent = document.getElementsByClassName(
                'app-wrapper'
            )[0];
            appComponent.classList.remove('print-single-page');
        });
    }

    componentWillUnmount() {
        window.removeEventListener('beforeprint');
        window.removeEventListener('afterprint');
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

App.childContextTypes = {
    baseUrl: PropTypes.string,
    i18n: PropTypes.object,
    d2: PropTypes.object,
};

const mapDispatchToProps = dispatch => {
    return {
        setCurrentUser: currentUser => dispatch(acReceivedUser(currentUser)),
        fetchDashboards: () => dispatch(tFetchDashboards()),
        setControlBarRows: () => dispatch(tSetControlBarRows()),
        setDimensions: d2 => dispatch(tSetDimensions(d2)),
    };
};

export default connect(
    null,
    mapDispatchToProps
)(App);
