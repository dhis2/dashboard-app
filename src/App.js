import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DashboardListCt from  './components/DashboardSelect/DashboardSelectCt';
import DashboardTitleCt from  './components/DashboardTitle/DashboardTitleCt';
import DashboardItemGridCt from  './components/DashboardItemGrid/DashboardItemGridCt';
import { acSetDashboards } from './actions';
import { getDashboards } from './data';

import './App.css';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// TODO, add to plugin instead
global.reportTablePlugin.type = 'REPORTTABLE';
global.chartPlugin.type = 'CHART';

class App extends Component {
    render() {
        return (
            <div className="wrapper">
                <HeaderBar />
                <DashboardListCt />
                <DashboardTitleCt />
                <DashboardItemGridCt />
            </div>
        );
    }
    getChildContext() {
        return {
            d2: this.props.d2
        };
    }
    componentDidMount() {
        const { store } = this.context;
        //const { d2 } = this.props;

        store.dispatch(acSetDashboards(getDashboards()));
    }
}

App.contextTypes = {
    store: PropTypes.object
};

App.childContextTypes = {
    d2: PropTypes.object
};

export default App;
