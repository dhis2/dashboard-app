import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DashboardListCt from  './containers/DashboardListCt';
import { acSetDashboards } from './actions';
import { actionTypes } from './reducers';
import data from './data';

import './App.css';
import './styles/gridstack-overrides.css';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import isFunction from 'd2-utilizr/lib/isFunction';

const $ = global.jQuery;

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

// TODO, add to plugin instead
global.reportTablePlugin.type = 'REPORTTABLE';
global.chartPlugin.type = 'CHART';

let grid;
let cache;

function getConfig() {
    const elements = Array.prototype.slice.call($('.grid-stack > .grid-stack-item'));
    const configObjects = [];
    let node;

    elements.forEach(function(element) {
        element = $(element);

        node = element.data('_gridstack_node');
        console.log("node", node);

        configObjects.push({
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height
        });
    });

    console.log("configObjects", configObjects);

    return configObjects;
}

function setConfig(config) {
    if (!config) {
        return;
    }

    grid.removeAll();

    config.forEach(function(node) {
        grid.addWidget($(
            '<div data-gs-id="' + node.id + '" data-gs-type="' + node.type + '" style="background-color:#fff">' +
                '<div class="grid-stack-item-content">' +
                    '<div class="dashboard-item-header" style="padding:2px">(' + node.name + ')</div>' +
                    '<div class="dashboard-item-content" id="plugin-' + node.id + '"></div>' +
                '</div>' +
            '</div>'),
            node.x, node.y, node.width, node.height);
    });
}

function storeConfig(config) {
    cache = config || getConfig();
}

function restoreConfig() {
    setConfig(cache);

    let customData;

    // plugins
    [global.reportTablePlugin, global.chartPlugin].forEach(plugin => {
        plugin.url = '//localhost:8080';
        plugin.username = 'admin';
        plugin.password = 'district';
        plugin.loadingIndicator = true;

        customData = data.filter(d => d.type === plugin.type).map(d => ({id: d.id, el: "plugin-" + d.id, type: d.type}));

        // add plugin items
        customData.forEach(d => plugin.add(d));

        plugin.load();

        customData.forEach(d => {
            (function(element) {
                console.log(element);
            })(document.getElementById(d.el));
        });
    });
}

function init() {
    const el = $('.grid-stack');

    const itemResize = (e) => {
        setTimeout(() => {
            const el = document.getElementById('plugin-' + e.target.dataset.gsId);

            if (el && isFunction(el.setViewportSize)) {
                el.setViewportSize($(e.target).width() - 30, $(e.target).height() - 16);
            }
        }, 10);
    };

    const options = {
        verticalMargin: 10,
        width: 50
    };

    el.gridstack(options);

    el.on('resizestop', itemResize);

    grid = el.data('gridstack');

    storeConfig(data);

    restoreConfig();
}

// const MyCmp = ({ myProp, klikk }, { d2 }) => {
//     console.log("<inside stateless sub component>");
//     return <div style={{padding: "30px"}} onClick={klikk}>React provider context: {d2.currentUser.name}<br/>My prop: {myProp}</div>;
// };
//
// MyCmp.contextTypes = {
//     d2: PropTypes.object
// };


// not using redux yet
class App extends Component {
    render() {
        return (
            <div>
                <HeaderBar />
                <DashboardListCt />
                <div className="grid-stack"></div>
            </div>
        );
    }
    getChildContext() {
        return {
            d2: this.props.d2
        };
    }
    componentDidMount() {
        init();

        const { store } = this.context;
        //const { d2 } = this.props;

        store.dispatch(acSetDashboards(data));
    }
}

App.contextTypes = {
    store: PropTypes.object
};

App.childContextTypes = {
    d2: PropTypes.object
};

export default App;
