import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DashboardSelectCt from  './components/DashboardSelect/DashboardSelectCt';
import DashboardTitleCt from  './components/DashboardTitle/DashboardTitleCt';
import DashboardItemGridCt from  './components/DashboardItemGrid/DashboardItemGridCt';
import { tSetDashboards } from './actions';

import './App.css';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// TODO, add to plugin instead
global.reportTablePlugin.type = 'REPORT_TABLE';
global.chartPlugin.type = 'CHART';

class App extends Component {
    render() {
        return (
            <div>
                <HeaderBar />
                <div className="DashboardSelect">
                    <div className="wrapper">
                        <DashboardSelectCt />
                        <DashboardTitleCt />
                        <DashboardItemGridCt />
                    </div>
                </div>
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

        store.dispatch(tSetDashboards());

        //store.dispatch(acSetDashboards(getDashboards()));
    }
}

App.contextTypes = {
    store: PropTypes.object
};

App.childContextTypes = {
    d2: PropTypes.object
};

export default App;
