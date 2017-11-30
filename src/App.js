import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import DashboardTitleCt from './DashboardTitle/DashboardTitle';
import DashboardItemGridCt from './DashboardItemGrid/DashboardItemGrid';
import DashboardBarCt from './DashboardBar/DashboardBar';
import DashboardSelectCt from './DashboardSelect/DashboardSelect';
import DashboardItemCt from './DashboardContent/DashboardItem';
import { tSetDashboards } from './actions';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// TODO, add to plugin instead
if (global.reportTablePlugin) {
    global.reportTablePlugin.type = 'REPORT_TABLE';
}

if (global.chartPlugin) {
    global.chartPlugin.type = 'CHART';
}

class App extends Component {
    componentDidMount() {
        const { store } = this.context;
        store.dispatch(tSetDashboards());
    }
    render() {
        return (
            <div>
                <HeaderBar />
                <div className="DashboardSelect">
                    <div className="wrapper" />
                </div>
                <div className="wrapper" />
                <DashboardItemCt />
            </div>
        );
    }
}

App.contextTypes = {
    d2: PropTypes.object,
    store: PropTypes.object,
};

export default App;
