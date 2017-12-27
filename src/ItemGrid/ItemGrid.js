import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './ItemGrid.css';
import ItemHeader from './ItemHeader';
import ItemFooter from './ItemFooter';

import { gridRowHeight, getGridColumns, gridCompactType } from './gridUtil';
import {
    getPluginByType,
    getFavoriteObjectFromItem,
    getPluginItemConfig,
    renderFavorites,
    onPluginItemResize,
} from './pluginUtil';

import { orObject } from '../util';
import * as fromReducers from '../reducers';
import { apiFetchFavorite } from '../api';
import ModalLoadingMask from '../widgets/ModalLoadingMask';

const { fromSelected } = fromReducers;

// Component

let cachedIds = '';
let cachedEdit = false;

const shouldPluginRender = (dashboardItems, edit) => {
    if (dashboardItems.length) {
        const ids = dashboardItems.map(item => item.id).join('-');

        if (ids !== cachedIds || edit !== cachedEdit) {
            cachedIds = ids;
            cachedEdit = edit;

            return true;
        }
    }

    return false;
};

export class ItemGrid extends Component {
    componentDidUpdate() {
        const { dashboardItems, edit } = this.props;

        if (shouldPluginRender(dashboardItems, edit)) {
            console.log('RENDER FAVORITES');
            renderFavorites(dashboardItems);
        }
    }

    state = {
        showInterpretations: false,
        visId: '',
    };

    onInterpretationsClick = clickedId => {
        this.setState({ showInterpretations: !this.state.showInterpretations });
        this.setState({ visId: clickedId });
    };

    render() {
        const {
            isLoading,
            dashboardItems,
            onButtonClick,
            onItemResize,
            edit,
        } = this.props;

        if (!dashboardItems.length) {
            return <div style={{ padding: 50 }}>No items</div>;
        }

        this.pluginItems = dashboardItems.map((item, index) =>
            Object.assign({}, item, {
                i: `${getFavoriteObjectFromItem(item).id}`,
                static: !edit,
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
                    layout={this.pluginItems}
                    cols={getGridColumns()}
                    rowHeight={gridRowHeight}
                    width={window.innerWidth}
                    compactType={gridCompactType}
                >
                    {this.pluginItems
                        .filter(item => getFavoriteObjectFromItem(item)) //TODO IMPROVE
                        .map(item => {
                            const favorite = getFavoriteObjectFromItem(item);

                            let interpretations = [];
                            switch (item.type) {
                                case 'CHART':
                                    interpretations =
                                        item.chart.interpretations;
                                    break;
                                case 'REPORT_TABLE':
                                    interpretations =
                                        item.reportTable.interpretations;
                                    break;
                                default:
                                    interpretations = [];
                                    break;
                            }

                            const showInterpretations =
                                this.state.visId === item.id;

                            return (
                                <div key={item.i} className={item.type}>
                                    <ItemHeader
                                        type={item.type}
                                        favoriteId={favorite.id}
                                        favoriteName={favorite.name}
                                        onButtonClick={onButtonClick}
                                        onInterpretationsClick={() =>
                                            this.onInterpretationsClick(item.id)
                                        }
                                    />
                                    <div
                                        id={`plugin-${
                                            getFavoriteObjectFromItem(item).id
                                        }`}
                                        className="dashboard-item-content"
                                    />
                                    <ItemFooter
                                        interpretations={interpretations}
                                        show={showInterpretations}
                                        onToggleInterpretations={
                                            this.onInterpretationsClick
                                        }
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
    const { sGetSelectedIsLoading, sGetSelectedEdit } = fromSelected;

    const selectedDashboard = sGetSelectedDashboard(state);
    const dashboardItems = orObject(selectedDashboard).dashboardItems;

    return {
        dashboardItems,
        isLoading: sGetSelectedIsLoading(state),
        edit: sGetSelectedEdit(state),
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
