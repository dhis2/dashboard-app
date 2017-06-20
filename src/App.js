import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

const $ = global.jQuery;

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
            height: node.height,
            text: node.el[0].attributes['data-gs-text'].value
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
            '<div data-gs-text="' + node.text + '">' +
                '<div class="grid-stack-item-content">' +
                    '<div class="dashboard-item-header">header</div>' +
                    '<div id="' + node.id + '" class="dashboard-item-content">' + node.text + '</div>' +
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
}

function init() {
    const el = $('.grid-stack');

    const itemResize = (e) => {
        setTimeout(() => {
            console.log(getConfig());
        }, 10);
    };

    const options = {
        cellHeight: 80,
        verticalMargin: 10
    };

    el.gridstack(options);

    el.on('resizestop', itemResize);

    grid = el.data('gridstack');

    storeConfig([
        {x: 0, y: 0, width: 2, height: 2, text: "item 1", id: "uid1"},
        {x: 2, y: 0, width: 2, height: 2, text: "item 2", id: "uid2"},
        {x: 4, y: 0, width: 2, height: 2, text: "item 3", id: "uid3"}
    ]);

    restoreConfig();
}

class App extends Component {
    componentDidMount() {
        init();

        const { store } = this.context;

        store.dispatch({
            type: 'SELECT_DASHBOARD',
            dashboard: {
                id: 1
            }
        });
    }
    render() {
        return <div className="grid-stack"></div>;
    }
}

App.contextTypes = {
    store: PropTypes.object
};

export default App;
