import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import isFunction from 'd2-utilizr/lib/isFunction';

import './DashboardItemGrid.css';
import DashboardItemHeader from './DashboardItemHeader';

import { gridColumns, gridRowHeight, addShapeToItems } from './gridUtil';
import {
    getPluginByType,
    getFavoriteObjectFromItem,
    getPluginItemConfig,
    renderFavorites,
} from './pluginUtil';

import { orArray, orObject } from '../util';

import * as fromReducers from '../reducers';
import { apiFetchFavorite } from '../api';

const { fromSelected } = fromReducers;

// Components

export class DashboardItemGrid extends Component {
    componentDidUpdate() {
        const { dashboardItems } = this.props;

        if (dashboardItems.length) {
            renderFavorites(dashboardItems);
        }
    }

    render() {
        const {
            isLoading,
            dashboardItems,
            onButtonClick,
            onItemResize,
        } = this.props;

        if (isLoading) {
            return <div style={{ padding: 50 }}>Loading...</div>;
        }

        if (!dashboardItems.length) {
            return <div style={{ padding: 50 }}>No items</div>;
        }

        const pluginItems = dashboardItems.map((item, index) =>
            Object.assign({}, item, {
                i: `${getFavoriteObjectFromItem(item).id}`,
            })
        );

        return (
            <div className="dashboard-grid-wrapper">
                <ReactGridLayout
                    onLayoutChange={(a, b, c) => {
                        console.log('RGL change', a, b, c);
                    }}
                    onResizeStop={(layout, oldItem, newItem) => {
                        onItemResize(newItem.i);
                    }}
                    className="layout"
                    layout={pluginItems}
                    cols={gridColumns}
                    rowHeight={gridRowHeight}
                    width={window.innerWidth}
                >
                    {pluginItems
                        .filter(item => getFavoriteObjectFromItem(item)) //TODO IMPROVE
                        .map(item => {
                            const favorite = getFavoriteObjectFromItem(item);

                            return (
                                <div key={item.i} className={item.type}>
                                    <DashboardItemHeader
                                        type={item.type}
                                        favoriteId={favorite.id}
                                        favoriteName={favorite.name}
                                        onButtonClick={onButtonClick}
                                    />
                                    <div
                                        id={`plugin-${
                                            getFavoriteObjectFromItem(item).id
                                        }`}
                                        className="dashboard-item-content"
                                    />
                                </div>
                            );
                        })}
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
    const { sGetSelectedIsLoading } = fromSelected;

    const selectedDashboard = sGetSelectedDashboard(state);
    const dashboardItems = orObject(selectedDashboard).dashboardItems;
    const dashboardItemsWithShape = addShapeToItems(orArray(dashboardItems));

    console.log('selectedDashboard', selectedDashboard);
    console.log('dashboardItems', dashboardItems);
    console.log('dashboardItemsWithShape', dashboardItemsWithShape);

    return {
        isLoading: sGetSelectedIsLoading(state),
        dashboardItems: dashboardItemsWithShape,
        onButtonClick: (id, type, targetType) => {
            const plugin = getPluginByType(targetType);

            apiFetchFavorite(id, type).then(favorite => {
                const itemConfig = getPluginItemConfig(favorite, true);
                console.log('plugin itemConfig', itemConfig);

                plugin.load(itemConfig);
            });
        },
        onItemResize: id => {
            const el = orObject(document.querySelector(`#plugin-${id}`));
            const fn = el.setViewportWidth;

            if (isFunction(fn)) {
                setTimeout(() => el.setViewportWidth(el.clientWidth - 20), 100);
            }
        },
    };
};

const DashboardItemGridCt = connect(mapStateToProps)(DashboardItemGrid);

export default DashboardItemGridCt;
