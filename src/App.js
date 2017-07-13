import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DashboardListCt from  './containers/DashboardListCt';
import DashboardItemGridCt from  './containers/DashboardItemGridCt';
import { acSetDashboards } from './actions';
import { getDashboards } from './data';

import './App.css';
import './styles/gridstack-overrides2.css';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// TODO, add to plugin instead
global.reportTablePlugin.type = 'REPORTTABLE';
global.chartPlugin.type = 'CHART';

// function getConfig() {
//     const elements = Array.prototype.slice.call($('.grid-stack > .grid-stack-item'));
//     const configObjects = [];
//     let node;
//
//     elements.forEach(function(element) {
//         element = $(element);
//
//         node = element.data('_gridstack_node');
//         console.log("node", node);
//
//         configObjects.push({
//             x: node.x,
//             y: node.y,
//             width: node.width,
//             height: node.height
//         });
//     });
//
//     console.log("configObjects", configObjects);
//
//     return configObjects;
// }

class App extends Component {
    render() {
        return (
            <div>
                <HeaderBar />
                <DashboardListCt />
                <DashboardItemGridCt />
            </div>
        );
    }
    getChildContext() {
        return {
            d2: this.props.d2,
            grid: this.props.grid
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
    d2: PropTypes.object,
    grid: PropTypes.object
};

export default App;
