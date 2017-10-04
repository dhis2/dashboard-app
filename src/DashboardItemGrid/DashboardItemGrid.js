import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import './DashboardItemGrid.css';

import * as fromReducers from '../reducers';

const { fromSelectedDashboard } = fromReducers;

const runPlugins = (items) => {
    let filteredItems;

    const url = '//localhost:8080';
    const username = 'admin';
    const password = 'district';

    // plugins
    [global.reportTablePlugin, global.chartPlugin].forEach((plugin) => {
        plugin.url = url;
        plugin.username = username;
        plugin.password = password;
        plugin.loadingIndicator = true;
        plugin.dashboard = true;

        filteredItems = items.filter(d => d.type === plugin.type).map(d => ({ id: d.id, el: `plugin-${d.id}`, type: d.type }));

        // add plugin items
        filteredItems.forEach(d => plugin.add(d));

        plugin.load();

        filteredItems.forEach((d) => {
            ((element) => {
                console.log(element);
            })(document.getElementById(d.el));
        });
    });

    // map
    setTimeout(() => {
        filteredItems = items.filter(d => d.type === 'MAP').map(d => ({ id: d.id, el: `plugin-${d.id}`, type: d.type, url, username, password }));
        console.log(filteredItems);

        filteredItems.forEach(d => global.DHIS.getMap(d));
    }, 200);
};

export class DashboardItemGrid extends Component {
    componentDidUpdate() {
        const { selectedDashboard } = this.props;

        const dashboardItems = selectedDashboard.dashboardItems || [];

        console.log('dashboardItems', dashboardItems);

        runPlugins(dashboardItems);
    }

    render() {
        const { selectedDashboard } = this.props;

        if (selectedDashboard === null) {
            return (<div style={{ padding: 50 }}>No items</div>);
        }

        const dashboardItems = selectedDashboard.dashboardItems || [];

        const pluginItems = dashboardItems.map((item, index) => Object.assign({}, item, { i: `${index}` }));

        return (
            <div style={{ margin: '10px' }}>
                <ReactGridLayout
                    onLayoutChange={(a, b, c) => console.log(a, b, c)}
                    className="layout"
                    layout={pluginItems}
                    cols={30}
                    rowHeight={30}
                    width={window.innerWidth}
                >
                    {pluginItems.map((item => (
                        <div key={item.i} className={item.type}>
                            <div style={{ padding: 5, fontSize: 11, fontWeight: 500, color: '#555' }}>{`Item ${item.i}`} {'options'}</div>
                            <div id={`plugin-${item.id}`} className={'pluginItem'} />
                        </div>
                    )))}
                    {}
                </ReactGridLayout>
            </div>
        );
    }
}

DashboardItemGrid.propTypes = {
    selectedDashboard: PropTypes.object,
};

DashboardItemGrid.defaultProps = {
    selectedDashboard: {},
};

// Container

const mapStateToProps = state => ({
    selectedDashboard: fromSelectedDashboard.uGetTransformedItems(fromSelectedDashboard.sGetSelectedDashboardItems(state)),
});

const DashboardItemGridCt = connect(mapStateToProps)(DashboardItemGrid);

export default DashboardItemGridCt;
