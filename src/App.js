import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import PageContainer from './PageContainer/PageContainer';
import PageContainerSpacer from './PageContainer/PageContainerSpacer';
import ControlBarContainer from './ControlBarContainer/ControlBarContainer';
import SnackbarMessage from './SnackbarMessage';

import { fromDashboards, fromUser, fromControlBar } from './actions';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class App extends Component {
    componentDidMount() {
        const { store, d2 } = this.context;
        store.dispatch(fromUser.acReceivedUser(d2.currentUser));
        store.dispatch(fromDashboards.tSetDashboards());
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
                <ControlBarContainer />
                <PageContainerSpacer />
                <PageContainer />
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
