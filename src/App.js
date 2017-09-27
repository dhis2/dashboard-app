import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import DashboardTitleCt from './components/DashboardTitle/DashboardTitleCt';
import DashboardItemGridCt from './DashboardItemGrid/DashboardItemGrid';
import DashboardBarCt from './DashboardBar/DashboardBar';
import DashboardSelectCt from './DashboardSelect/DashboardSelect';
import { tSetDashboards } from './actions';

import './App.css';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// TODO, add to plugin instead
global.reportTablePlugin.type = 'REPORT_TABLE';
global.chartPlugin.type = 'CHART';

class App extends Component {
    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }
    componentDidMount() {
        const { store } = this.context;
        // const { d2 } = this.props;

        store.dispatch(tSetDashboards());
    }
    render() {
        return (
            <div>
                <HeaderBar />
                <div className="DashboardSelect">
                    <div className="wrapper">
                        <DashboardBarCt />
                        <DashboardSelectCt />
                    </div>
                </div>
                <div className="wrapper">
                    <DashboardTitleCt />
                    <DashboardItemGridCt />
                </div>
            </div>
        );
    }
}

App.propTypes = {
    d2: PropTypes.object,
};

App.defaultProps = {
    d2: {},
};

App.contextTypes = {
    store: PropTypes.object,
};

App.childContextTypes = {
    d2: PropTypes.object,
};

export default App;
