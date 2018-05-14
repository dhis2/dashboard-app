import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import Snackbar from 'material-ui/Snackbar';

import Dashboard from './Dashboard/Dashboard';
import SnackbarMessage from './SnackbarMessage';

import { fromDashboards, fromUser, fromControlBar } from './actions';
import { acCloseSnackbar } from './actions/snackbar';
import { fromSnackbar } from './reducers';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// App
class App extends Component {
    componentDidMount() {
        console.log('this.props', this.props);

        const { store, d2 } = this.context;
        store.dispatch(fromUser.acReceivedUser(d2.currentUser));
        console.log(
            'this.props.match.params.dashboardId',
            this.props.match.params.dashboardId
        );

        store.dispatch(
            fromDashboards.tSetDashboards(
                this.props.match.params.dashboardId || null
            )
        );
        store.dispatch(fromControlBar.tSetControlBarRows());
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
        return (
            <div className="app-wrapper">
                <HeaderBar />
                <Dashboard />
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
    return {
        snackbarOpen: open,
        snackbarMessage: message,
        snackbarDuration: duration,
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

const AppCt = connect(mapStateToProps, {
    acCloseSnackbar,
})(App);

export default AppCt;
