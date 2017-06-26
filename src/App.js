import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

const $ = global.jQuery;

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const data = [
    {x: 0, y: 0, width: 5, height: 14, text: "plugin item 1", id: "fzgIcU3hVFH", type: "REPORTTABLE"},
    {x: 5, y: 0, width: 5, height: 3, text: "plugin item 2", id: "DkPKc1EUmC2", type: "CHART"},
    {x: 5, y: 3, width: 5, height: 2, text: "plugin item 3", id: "hewtA7a025J", type: "CHART"},
    {x: 11, y: 0, width: 2, height: 5, text: "plugin item 4", id: "BIJgq4OOT3a", type: "REPORTTABLE"},
    {x: 6, y: 5, width: 7, height: 9, text: "plugin item 5", id: "hrDweynvx7G", type: "REPORTTABLE"},
];

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
            '<div data-gs-id="' + node.id + '" style="background-color:#fff">' +
                '<div class="grid-stack-item-content" style="background-color:#fff">' +
                    '<div class="dashboard-item-header" style="padding:2px">(' + node.text + ')</div>' +
                    '<div id="' + node.id + '" class="dashboard-item-content" style="height:' + (node.height * 80) + 'px">' + node.text + '</div>' +
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

    // plugins
    [global.reportTablePlugin, global.chartPlugin].forEach(plugin => {
        plugin.url = '//localhost:8080';
        plugin.username = 'admin';
        plugin.password = 'district';
        plugin.loadingIndicator = true;

        data.filter(d => d.type === plugin.type).map(d => ({id: d.id, el: d.id, type: d.type})).forEach(d => plugin.add(d));

        plugin.load();
    });
}

function init() {
    const el = $('.grid-stack');

    const itemResize = (e) => {
        setTimeout(() => {
            console.log(e, getConfig());
            console.log("resized id: " + e.target.dataset.gsId);
        }, 10);
    };

    const options = {
        cellHeight: 80,
        verticalMargin: 10
    };

    el.gridstack(options);

    el.on('resizestop', itemResize);

    grid = el.data('gridstack');

    storeConfig(data);

    restoreConfig();
}

const MyCmp = (props, context) => {
    console.log("context", context);
    return <div>React provider context: {context.d2.currentUser.name}</div>;
};

MyCmp.contextTypes = {
    d2: PropTypes.object
};

class App extends Component {
    getChildContext() {
        return {
            d2: this.props.d2
        };
    }
    componentDidMount() {
        init();

        const { store } = this.context;
        //const { d2 } = this.props;

        store.dispatch({
            type: 'SELECT_DASHBOARD',
            dashboard: {
                id: 1
            }
        });
    }
    render() {
        return (
            <div>
                <HeaderBar />
                <div className="grid-stack"></div>
                <MyCmp />
            </div>
        );
    }
}

App.contextTypes = {
    store: PropTypes.object
};

App.childContextTypes = {
    d2: PropTypes.object
};

export default App;
