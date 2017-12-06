import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import './DashboardItemGrid.css';

import { gridColumns, gridRowHeight } from './gridUtil';

import { orArray, orObject } from '../util';

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

    return (
        <div className="dashboard-item-header">
            <span>{getFavorite(item).name}</span>
            <ItemButton text={'M'} />
            <ItemButton text={'C'} />
            <ItemButton id={'hlzEdAWPd4L'} text={'P'} />
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
            console.log('d-1', d);
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

        if (dashboardItems.length) {
            runPlugins(dashboardItems);
        }
    }

    render() {
        console.log('DIG props', this.props);
        const { dashboardItems } = this.props;

        if (!dashboardItems.length) {
            return <div style={{ padding: 50 }}>No items</div>;
        }

        const pluginItems = dashboardItems.map((item, index) =>
            Object.assign({}, item, { i: `${index}` })
        );

        return (
            <div className="dashboard-grid-wrapper">
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
                                className="dashboard-item-content"
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

const mapStateToProps = state => {
    const { sGetSelectedDashboard } = fromReducers;
    const { uGetTransformedItems } = fromSelected;

    return {
        dashboardItems: uGetTransformedItems(
            orArray(orObject(sGetSelectedDashboard(state)).dashboardItems)
        ),
    };
};

const mapDispatchToProps = dispatch => {
    return { onPivotClick: id => {} };
};

const mergedProps = (stateProps, dispatchProps) => {
    return {
        ...stateProps,
        ...dispatchProps,
    };
};

const DashboardItemGridCt = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergedProps
)(DashboardItemGrid);

export default DashboardItemGridCt;
