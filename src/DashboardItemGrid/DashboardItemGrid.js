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

        let favorite;

        filteredItems = items
            .filter(item => item.type === plugin.type)
            .map(item => {
                favorite = getFavorite(item);

                return {
                    id: favorite.id,
                    el: `plugin-${favorite.id}`,
                    type: item.type,
                    hideTitle: !favorite.title,
                };
            });

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
    filteredItems = items.filter(item => item.type === 'MAP').map(item => ({
        id: getFavorite(item).id,
        el: `plugin-${getFavorite(item).id}`,
        type: item.type,
        url,
        username,
        password,
    }));
    console.log('gis filteredItems', filteredItems);

    if (filteredItems.length) {
        setTimeout(() => {
            filteredItems.forEach(item => global.DHIS.getMap(item));
        }, 200);
    }
};

const ItemBar = ({ item }) => {
    const id = getFavorite(item).id;
    console.log('id', id);

    return (
        <div
            style={{
                padding: 10,
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
            }}
        >
            <span>{getFavorite(item).name}</span>
            <ItemButton id={'hlzEdAWPd4L'} text={'P'} />
            <ItemButton text={'C'} />
            <ItemButton text={'M'} />
        </div>
    );
};

const ItemButton = ({ id, text }) => {
    let cmp;

    (function(_id) {
        cmp = (
            <button
                type="button"
                style={{
                    float: 'right',
                }}
                onClick={() => reload(_id)}
            >
                {text}
            </button>
        );
    })(id);

    return cmp;
};

const reload = (id, type) => {
    fetch(
        '//localhost:8080/api/charts/hlzEdAWPd4L.json?fields=id,name,columns[*,items[dimensionItem~rename(id)]],rows[*,items[dimensionItem~rename(id)]],filters[*,items[dimensionItem~rename(id)]]',
        {
            headers: {
                Authorization: 'Basic ' + btoa('admin:district'),
            },
        }
    )
        .then(data => data.json())
        .then(d => {
            console.log('d', d);
            global.reportTablePlugin.load({
                el: 'plugin-hlzEdAWPd4L',
                columns: d.columns,
                rows: d.rows,
                filters: d.filters,
                hideTitle: !d.title,
            });
        });
};

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
                            <ItemBar item={item} />
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
