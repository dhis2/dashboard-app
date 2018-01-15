import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './ItemGrid.css';
import { Item } from '../Item/Item';

import {
    gridRowHeight,
    getGridColumns,
    gridCompactType,
    onItemResize,
} from './gridUtil';
import { orObject } from '../util';
import * as fromReducers from '../reducers';
import ModalLoadingMask from '../widgets/ModalLoadingMask';

const { fromSelected } = fromReducers;

export class ItemGrid extends Component {
    state = {
        expandedItems: {},
    };

    onToggleItemFooter = clickedId => {
        const isExpanded =
            typeof this.state.expandedItems[clickedId] === 'boolean'
                ? this.state.expandedItems[clickedId]
                : false;

        const expandedItems = { ...this.state.expandedItems };
        expandedItems[clickedId] = !isExpanded;

        this.setState({ expandedItems });
    };

    render() {
        const { isLoading, dashboardItems, edit } = this.props;

        if (!dashboardItems.length) {
            return <div style={{ padding: 50 }}>No items</div>;
        }

        const items = dashboardItems.map((item, index) => {
            const expandedItem = this.state.expandedItems[item.id];
            let hProp = { h: item.h };

            if (expandedItem && expandedItem === true) {
                hProp.h = item.h + 20;
            }

            return Object.assign({}, item, hProp, {
                i: item.id,
            });
        });

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
                    layout={items}
                    cols={getGridColumns()}
                    rowHeight={gridRowHeight}
                    width={window.innerWidth}
                    compactType={gridCompactType}
                    isDraggable={edit}
                    isResizable={edit}
                >
                    {items.map(item => {
                        return (
                            <div key={item.i} className={item.type}>
                                <Item
                                    item={item}
                                    editMode={edit}
                                    onToggleItemFooter={this.onToggleItemFooter}
                                />
                            </div>
                        );
                    })}
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

const mapStateToProps = state => {
    const { sGetSelectedDashboard } = fromReducers;
    const { sGetSelectedIsLoading, sGetSelectedEdit } = fromSelected;

    const selectedDashboard = sGetSelectedDashboard(state);
    const dashboardItems = orObject(selectedDashboard).dashboardItems;

    return {
        dashboardItems,
        isLoading: sGetSelectedIsLoading(state),
        edit: sGetSelectedEdit(state),
    };
};

const ItemGridCt = connect(mapStateToProps)(ItemGrid);

export default ItemGridCt;
