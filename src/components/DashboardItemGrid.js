import React, { Component } from 'react';

const $ = global.jQuery;

class DashboardItemGrid extends Component {
    componentDidUpdate() {
        const { grid, items } = this.props;

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
    render() {
        return (<div className="grid-stack"></div>);
    }
}

export default DashboardItemGrid;