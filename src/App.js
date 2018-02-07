import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import PageContainer from './PageContainer/PageContainer';
import ControlBarContainer from './ControlBarContainer/ControlBarContainer';
import TitleBarCt from './TitleBar/TitleBar';
import ItemGridCt from './ItemGrid/ItemGrid';

import { fromDashboards, fromUser } from './actions';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// App
class App extends Component {
    componentDidMount() {
        const { store, d2 } = this.context;
        store.dispatch(fromUser.acReceivedUser(d2.currentUser));
        store.dispatch(fromDashboards.tSetDashboards());
    }

    getChildContext() {
        return {
            baseUrl: this.props.baseUrl,
        };
    }

    render() {
        return (
            <div className="app-wrapper">
                <HeaderBar />
                <ControlBarContainer />
                <PageContainer>
                    <TitleBarCt />
                    <ItemGridCt />
                </PageContainer>
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
};

export default App;
