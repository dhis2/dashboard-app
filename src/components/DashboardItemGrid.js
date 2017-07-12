import React, { Component } from 'react';

const $ = global.jQuery;

const restoreItems = (grid, items) => {
    grid.removeAll();

    items.forEach(function(node) {
        grid.addWidget($(
                '<div data-gs-id="' + node.id + '" data-gs-type="' + node.type + '" style="background-color:#fff">' +
                '<div class="grid-stack-item-content">' +
                '<div class="dashboard-item-header" style="padding:2px">(' + node.type + ' ' + node.id + ')</div>' +
                '<div class="dashboard-item-content" id="plugin-' + node.id + '"></div>' +
                '</div>' +
                '</div>'),
            node.x, node.y, node.width, node.height);
    });
}

const runPlugins = (items) => {
    let filteredItems;

    // plugins
    [global.reportTablePlugin, global.chartPlugin].forEach(plugin => {
        plugin.url = '//localhost:8080';
        plugin.username = 'admin';
        plugin.password = 'district';
        plugin.loadingIndicator = true;

        filteredItems = items.filter(d => d.type === plugin.type).map(d => ({id: d.id, el: "plugin-" + d.id, type: d.type}));

        // add plugin items
        filteredItems.forEach(d => plugin.add(d));

        plugin.load();

        filteredItems.forEach(d => {
            (function(element) {
                console.log(element);
            })(document.getElementById(d.el));
        });
    });
};

class DashboardItemGrid extends Component {
    componentDidUpdate() {
        const { grid, items } = this.props;

        restoreItems(grid, items);

        runPlugins(items);
    }
    render() {
        return (<div className="grid-stack"></div>);
    }
}

export default DashboardItemGrid;