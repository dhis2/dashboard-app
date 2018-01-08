import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import {
    ControlBarContainer,
    controlBarRowHeight,
} from './ControlBarContainer/ControlBarContainer';

import ItemGridCt from './ItemGrid/ItemGrid';
import { fromDashboards, fromSelected } from './actions';

import './App.css';
import TitleBarCt from './TitleBar/TitleBar';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// TODO, add to plugin instead
if (global.reportTablePlugin) {
    global.reportTablePlugin.type = 'REPORT_TABLE';
}

if (global.chartPlugin) {
    global.chartPlugin.type = 'CHART';
}

// Adjust the top margin of the page so it starts below the control bar
const DynamicTopMarginContainer = ({ marginTop, children }) => (
    <div className="dashboard-wrapper" style={{ marginTop }}>
        {children}
    </div>
);
const PageContainer = connect(state => ({
    marginTop: state.controlBar.rows * controlBarRowHeight + 80,
}))(DynamicTopMarginContainer);

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
