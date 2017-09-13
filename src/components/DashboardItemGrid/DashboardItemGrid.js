import React, { Component } from 'react';

import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import './DashboardItemGrid.css';

const runPlugins = (items) => {
    let filteredItems;

    // plugins
    [global.reportTablePlugin, global.chartPlugin].forEach((plugin) => {
        plugin.url = '//localhost:8080';
        plugin.username = 'admin';
        plugin.password = 'district';
        plugin.loadingIndicator = true;
        plugin.dashboard = true;

        filteredItems = items.filter(d => d.type === plugin.type).map(d => ({ id: d.id, el: `plugin-${d.id}`, type: d.type }));

        // add plugin items
        filteredItems.forEach(d => plugin.add(d));

        plugin.load();

        filteredItems.forEach((d) => {
            (function (element) {
                console.log(element);
            }(document.getElementById(d.el)));
        });
    });
};

class DashboardItemGrid extends Component {
    componentDidUpdate() {
        const { items } = this.props;

        runPlugins(items);
    }

    render() {
        const items = this.props.items || [];

        items.forEach((item, index) => item.i = `${index}`);

        return (
            <div style={{ margin: '10px' }}>
                <ReactGridLayout
                    onLayoutChange={(a, b, c) => console.log(a, b, c)}
                    className="layout"
                    layout={items}
                    cols={30}
                    rowHeight={30}
                    width={window.innerWidth}
                >
                    {items.map(item => (
                        <div key={item.i} className={item.type}>
                            <div style={{ padding: 5, fontSize: 11, fontWeight: 500, color: '#555' }}>{`Item ${item.i}`} {'options'}</div>
                            <div id={`plugin-${item.id}`} className={'pluginItem'} />
                        </div>
                    ))}
                    {}
                </ReactGridLayout>
            </div>
        );
    }
}

export default DashboardItemGrid;
