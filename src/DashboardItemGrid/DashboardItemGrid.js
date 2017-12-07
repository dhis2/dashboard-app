import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './DashboardItemGrid.css';

import { gridColumns, gridRowHeight } from './gridUtil';
import {
    getFavoriteObjectByItem,
    getPluginItemConfig,
    renderFavorites,
} from './pluginUtil';

import { orArray, orObject } from '../util';

import * as fromReducers from '../reducers';

const { fromSelected } = fromReducers;

// Components

const ItemBar = ({ item }) => {
    const favorite = getFavoriteObjectByItem(item);

    return (
        <div className="dashboard-item-header">
            <div className="dashboard-item-header-title">{favorite.name}</div>
            <ItemButton id={favorite.id} text={'T'} />
            <ItemButton text={'C'} />
            <ItemButton text={'M'} />
        </div>
    );
};

const ItemButton = ({ id, text }) => (
    <button type="button" onClick={() => reload(id)}>
        {text}
    </button>
);

const reload = (id, type) => {
    fetch(
        `//localhost:8080/api/charts/${
            id
        }.json?fields=id,name,columns[*,items[dimensionItem~rename(id)]],rows[*,items[dimensionItem~rename(id)]],filters[*,items[dimensionItem~rename(id)]]`,
        {
            headers: {
                Authorization: 'Basic ' + btoa('admin:district'),
            },
        }
    )
        .then(data => data.json())
        .then(favorite =>
            global.reportTablePlugin.load(getPluginItemConfig(favorite, true))
        );
};

export class DashboardItemGrid extends Component {
    componentDidUpdate() {
        const { dashboardItems } = this.props;

        if (dashboardItems.length) {
            renderFavorites(dashboardItems);
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
                                id={`plugin-${
                                    getFavoriteObjectByItem(item).id
                                }`}
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
