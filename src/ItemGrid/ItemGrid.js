import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './ItemGrid.css';
import ItemHeader from './ItemHeader';

import {
    gridRowHeight,
    addShapeToItems,
    getGridColumns,
    gridVerticalCompact,
} from './gridUtil';
import {
    getPluginByType,
    getFavoriteObjectFromItem,
    getPluginItemConfig,
    renderFavorites,
    onPluginItemResize,
} from './pluginUtil';

import { orArray, orObject } from '../util';
import * as fromReducers from '../reducers';
import { apiFetchFavorite } from '../api';
import ModalLoadingMask from '../widgets/ModalLoadingMask';

const { fromSelected } = fromReducers;

// Component

let cachedItems = [];

export class ItemGrid extends Component {
    componentDidUpdate() {
        const { dashboardItems } = this.props;

        if (dashboardItems.length) {
            const ids = dashboardItems.map(item => item.id).join('-');
            const cachedIds = cachedItems.map(item => item.id).join('-');

            if (ids !== cachedIds) {
                console.log('renderFavorites');
                renderFavorites(dashboardItems);
            }

            cachedItems = dashboardItems;
        }
    }

    render() {
        const {
            isLoading,
            dashboardItems,
            onButtonClick,
            onItemResize,
        } = this.props;

        if (!dashboardItems.length) {
            return <div style={{ padding: 50 }}>No items</div>;
        }

        const pluginItems = dashboardItems.map((item, index) =>
            Object.assign({}, item, {
                i: `${getFavoriteObjectFromItem(item).id}`,
            })
        );

        return (
            <div className="grid-wrapper">
                <ModalLoadingMask isLoading={isLoading} />
                <ReactGridLayout
                    onLayoutChange={(a, b, c) => {
                        //console.log('RGL change', a, b, c);
                    }}
                    onResizeStop={(layout, oldItem, newItem) => {
                        onItemResize(newItem.i);
                    }}
                    className="layout"
                    layout={pluginItems}
                    cols={getGridColumns()}
                    rowHeight={gridRowHeight}
                    width={window.innerWidth}
                    verticalCompact={gridVerticalCompact}
                >
                    {pluginItems
                        .filter(item => getFavoriteObjectFromItem(item)) //TODO IMPROVE
                        .map(item => {
                            const favorite = getFavoriteObjectFromItem(item);

                            return (
                                <div key={item.i} className={item.type}>
                                    <ItemHeader
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

ItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
};

ItemGrid.defaultProps = {
    dashboardItems: [],
};

// Container

const currentItemTypeMap = {}; //TODO: improve

const mapStateToProps = state => {
    const { sGetSelectedDashboard } = fromReducers;
    const { sGetSelectedIsLoading } = fromSelected;

    const selectedDashboard = sGetSelectedDashboard(state);
    const dashboardItems = orObject(selectedDashboard).dashboardItems;
    const dashboardItemsWithShape = addShapeToItems(orArray(dashboardItems));

    return {
        isLoading: sGetSelectedIsLoading(state),
        dashboardItems: dashboardItemsWithShape,
        onButtonClick: (id, type, targetType) => {
            const plugin = getPluginByType(targetType);

            apiFetchFavorite(id, type).then(favorite => {
                const itemConfig = getPluginItemConfig(favorite, true);

                plugin.load(itemConfig);

                currentItemTypeMap[id] = targetType;
            });
        },
        onItemResize: id => {
            if (
                [undefined, 'CHART', 'EVENT_CHART'].indexOf(
                    currentItemTypeMap[id]
                ) !== -1
            ) {
                onPluginItemResize(id);
            }
        },
    };
};

const ItemGridCt = connect(mapStateToProps)(ItemGrid);

export default ItemGridCt;
