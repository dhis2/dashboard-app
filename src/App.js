import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import PageContainer from './PageContainer/PageContainer';
import ControlBarContainer from './ControlBarContainer/ControlBarContainer';
import TitleBarCt from './TitleBar/TitleBar';
import ItemGridCt from './ItemGrid/ItemGrid';

import { fromDashboards, fromSelected } from './actions';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// TODO TMP, add to plugin instead
if (global.reportTablePlugin) {
    global.reportTablePlugin.type = 'REPORT_TABLE';
}

if (global.chartPlugin) {
    global.chartPlugin.type = 'CHART';
}

// App
class App extends Component {
    componentDidMount() {
        const { store } = this.context;
        store.dispatch(fromDashboards.tSetDashboards()).then(() => {
            store.dispatch(
                fromSelected.tSetSelectedDashboardById('xP1jtPjus1c')
            );
        });
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

export default App;
