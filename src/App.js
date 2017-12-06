import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import DashboardItemGridCt from './DashboardItemGrid/DashboardItemGrid';
import { tSetSelectedDashboardById } from './actions';

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
        store.dispatch(tSetSelectedDashboardById('xP1jtPjus1c'));
    }
    render() {
        const { store } = this.context;
        console.log('render context store', store);
        return (
            <div>
                <HeaderBar />
                <DashboardItemGridCt store={store} />
            </div>
        );
    }
}

App.contextTypes = {
    d2: PropTypes.object,
    store: PropTypes.object,
};

export default App;
