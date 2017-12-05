import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import DashboardItem from '../DashboardContent/DashboardItem';

import './DashboardItemGrid.css';

import { gridColumns, gridRowHeight } from './gridUtil';

import * as fromReducers from '../reducers';

const { fromSelected } = fromReducers;

const getFavorite = item =>
    item.reportTable ||
    item.chart ||
    item.map ||
    item.eventReport ||
    item.eventChart;

const runPlugins = items => {
    let filteredItems;

    const url = '//localhost:8080';
    const username = 'admin';
    const password = 'district';

    // plugins
    [global.reportTablePlugin, global.chartPlugin].forEach(plugin => {
        plugin.url = url;
        plugin.username = username;
        plugin.password = password;
        plugin.loadingIndicator = true;
        plugin.dashboard = true;

        filteredItems = items
            .filter(item => item.type === plugin.type)
            .map(item => ({
                id: getFavorite(item).id,
                el: `plugin-${getFavorite(item).id}`,
                type: item.type,
            }));

        // add plugin items
        filteredItems.forEach(item => plugin.add(item));
        console.log('pt/dv filteredItems', filteredItems);
        plugin.load();

        filteredItems.forEach(item => {
            (element => {
                console.log(element);
            })(document.getElementById(item.el));
        });
    });

    // map
    setTimeout(() => {
        filteredItems = items.filter(item => item.type === 'MAP').map(item => ({
            id: getFavorite(item).id,
            el: `plugin-${getFavorite(item).id}`,
            type: item.type,
            url,
            username,
            password,
        }));
        console.log('gis filteredItems', filteredItems);

        filteredItems.forEach(item => global.DHIS.getMap(item));
    }, 200);
};

// const SomeCmp = ({ item }) => (
//     <div className={item.type}>
//         <div
//             style={{
//                 padding: 5,
//                 fontSize: 11,
//                 fontWeight: 500,
//                 color: '#555',
//             }}
//         >
//             {`Item ${item.i}`} {'options'}
//         </div>
//         <div id={`plugin-${getFavorite(item).id}`} className={'pluginItem'} />
//     </div>
// );

const Bar = ({ item }) => (
    <div
        style={{
            padding: 10,
            fontSize: 13,
            fontWeight: 600,
            color: '#333',
        }}
    >
        {getFavorite(item).name}
    </div>
);

export class DashboardItemGrid extends Component {
    componentDidUpdate() {
        const { dashboardItems } = this.props;
        console.log('componentDidUpdate DASHBOARDITEMS', dashboardItems);
        if (dashboardItems.length) {
            runPlugins(dashboardItems);
        }
    }

    render() {
        const { dashboardItems } = this.props;
        console.log('DASHBOARDITEMS FROM CT', dashboardItems);
        if (!dashboardItems.length) {
            return <div style={{ padding: 50 }}>No items</div>;
        }

        const pluginItems = dashboardItems.map((item, index) =>
            Object.assign({}, item, { i: `${index}` })
        );

        console.log('DASHBOARDITEMS > PLUGINITEMS', pluginItems);
        return (
            <div style={{ margin: '10px' }}>
                <ReactGridLayout
                    onLayoutChange={(a, b, c) => console.log('oLC', a, b, c)}
                    className="layout"
                    layout={pluginItems}
                    cols={gridColumns}
                    rowHeight={gridRowHeight}
                    width={window.innerWidth}
                >
                    {pluginItems.map(item => (
                        <div key={item.i} className={item.type}>
                            <Bar item={item} />
                            <div
                                id={`plugin-${getFavorite(item).id}`}
                                className={'pluginItem'}
                            />
                        </div>
                    ))}
                    {}
                </ReactGridLayout>
            </div>
        );
    }
}

DashboardItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
};

DashboardItemGrid.defaultProps = {
    dashboardItems: [],
};

// Container

const mapStateToProps = state => ({
    dashboardItems: fromSelected.uGetTransformedItems(
        (fromReducers.sGetSelectedDashboard(state) || {}).dashboardItems || []
    ),
});

const DashboardItemGridCt = connect(mapStateToProps)(DashboardItemGrid);

export default DashboardItemGridCt;
