import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
    acUpdateDashboardLayout,
    acRemoveDashboardItem,
} from '../actions/editDashboard';

import './ItemGrid.css';
import { Item } from '../Item/Item';
import DeleteItemButton from './DeleteItemButton';

import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    getGridColumns,
    hasShape,
    onItemResize,
} from './gridUtil';

import { orArray } from '../util';
import * as fromReducers from '../reducers';
import ModalLoadingMask from '../widgets/ModalLoadingMask';

// Component

const EXPANDED_HEIGHT = 20;

const NoItemsMessage = ({ text }) => (
    <div
        style={{
            padding: '50px 10px',
            textAlign: 'center',
            fontSize: '15px',
            fontWeight: 500,
            color: '#777',
        }}
    >
        {text}
    </div>
);

export class ItemGrid extends Component {
    state = {
        expandedItems: {},
    };

    NO_ITEMS_MESSAGE = 'You have not added any items';

    onToggleItemExpanded = clickedId => {
        const isExpanded =
            typeof this.state.expandedItems[clickedId] === 'boolean'
                ? this.state.expandedItems[clickedId]
                : false;

        const expandedItems = { ...this.state.expandedItems };
        expandedItems[clickedId] = !isExpanded;
        this.setState({ expandedItems });
    };

    onRemoveItem = clickedId => {
        this.props.acRemoveDashboardItem(clickedId);
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.edit) {
            this.setState({ expandedItems: {} });
        }
    }

    onLayoutChange = newLayout => {
        this.props.acUpdateDashboardLayout(newLayout);
    };

    render() {
        const { edit, isLoading, dashboardItems, onResizeStop } = this.props;

        if (!dashboardItems.length) {
            return <NoItemsMessage text={this.NO_ITEMS_MESSAGE} />;
        }

        const items = dashboardItems.map((item, index) => {
            const expandedItem = this.state.expandedItems[item.id];
            let hProp = { h: item.h };

            if (expandedItem && expandedItem === true) {
                hProp.h = item.h + EXPANDED_HEIGHT;
            }

            return Object.assign({}, item, hProp, {
                i: item.id,
            });
        });

        const onRemoveItemWrapper = id => () => this.onRemoveItem(id);

        return (
            <div className="grid-wrapper">
                <ModalLoadingMask isLoading={isLoading} />
                <ReactGridLayout
                    onLayoutChange={this.onLayoutChange}
                    onResizeStop={onResizeStop}
                    className="layout"
                    layout={items}
                    cols={getGridColumns()}
                    rowHeight={GRID_ROW_HEIGHT}
                    width={window.innerWidth}
                    compactType={GRID_COMPACT_TYPE}
                    isDraggable={edit}
                    isResizable={edit}
                    draggableCancel="input,textarea"
                >
                    {items.map(item => {
                        const itemClassNames = item.type.concat(
                            edit ? ' edit' : ' view'
                        );

                        return (
                            <div key={item.i} className={itemClassNames}>
                                {edit ? (
                                    <DeleteItemButton
                                        onClick={onRemoveItemWrapper(item.id)}
                                    />
                                ) : null}
                                <Item
                                    item={item}
                                    editMode={edit}
                                    onToggleItemExpanded={
                                        this.onToggleItemExpanded
                                    }
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

const onResizeStop = (layout, oldItem, newItem) => {
    onItemResize(newItem.i);
};

const mapStateToProps = state => {
    const { sGetSelectedDashboard, fromSelected } = fromReducers;
    const { sGetSelectedIsLoading, sGetSelectedEdit } = fromSelected;

    const selectedDashboard = sGetSelectedDashboard(state);

    const dashboardItems = selectedDashboard
        ? selectedDashboard.dashboardItems
        : null;

    return {
        edit: sGetSelectedEdit(state),
        isLoading: sGetSelectedIsLoading(state),
        dashboardItems,
    };
};

const mapDispatchToProps = {
    acUpdateDashboardLayout,
    acRemoveDashboardItem,
};

const mergeProps = (stateProps, dispatchProps) => {
    const validItems = orArray(stateProps.dashboardItems).filter(hasShape);

    return {
        ...dispatchProps,
        edit: stateProps.edit,
        isLoading: stateProps.isLoading,
        dashboardItems: validItems,
        onItemResize,
        onResizeStop,
    };
};

const ItemGridCt = connect(mapStateToProps, mapDispatchToProps, mergeProps)(
    ItemGrid
);

export default ItemGridCt;
