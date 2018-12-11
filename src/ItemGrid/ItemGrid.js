import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';
import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
    acUpdateDashboardLayout,
    acRemoveDashboardItem,
} from '../actions/editDashboard';

import './ItemGrid.css';
import { Item } from '../Item/Item';
import { resize as pluginResize } from '../Item/PluginItem/plugin';
import { isPluginType } from '../itemTypes';
import DeleteItemButton from './DeleteItemButton';

import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    ITEM_MIN_HEIGHT,
    MARGIN,
    getGridColumns,
    hasShape,
    onItemResize,
} from './gridUtil';

import { orArray } from '../util';
import * as fromReducers from '../reducers';
import ModalLoadingMask from '../widgets/ModalLoadingMask';
import NoContentMessage from '../widgets/NoContentMessage';

// Component

const EXPANDED_HEIGHT = 20;

export class ItemGrid extends Component {
    state = {
        expandedItems: {},
    };

    NO_ITEMS_MESSAGE = i18n.t('There are no items on this dashboard');

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
        if (this.props.edit) {
            this.props.acUpdateDashboardLayout(newLayout);
        }
    };

    onResizeStop = (layout, oldItem, newItem) => {
        onItemResize(newItem.i);

        const dashboardItem = this.props.dashboardItems.find(
            item => item.id === newItem.i
        );

        // call resize on the item component if it's a plugin type
        if (dashboardItem && isPluginType(dashboardItem)) {
            pluginResize(dashboardItem);
        }
    };

    onRemoveItemWrapper = id => () => this.onRemoveItem(id);

    render() {
        const { edit, isLoading, dashboardItems } = this.props;

        if (!isLoading && !dashboardItems.length) {
            return <NoContentMessage text={this.NO_ITEMS_MESSAGE} />;
        }

        const items = dashboardItems.map((item, index) => {
            const expandedItem = this.state.expandedItems[item.id];
            let hProp = { h: item.h };

            if (expandedItem && expandedItem === true) {
                hProp.h = item.h + EXPANDED_HEIGHT;
            }

            return Object.assign({}, item, hProp, {
                i: item.id,
                minH: ITEM_MIN_HEIGHT,
            });
        });

        return (
            <div className="grid-wrapper">
                <ModalLoadingMask isLoading={isLoading} />
                <ReactGridLayout
                    onLayoutChange={this.onLayoutChange}
                    onResizeStop={this.onResizeStop}
                    className="layout"
                    layout={items}
                    margin={MARGIN}
                    cols={getGridColumns()}
                    rowHeight={GRID_ROW_HEIGHT}
                    width={window.innerWidth}
                    compactType={GRID_COMPACT_TYPE}
                    isDraggable={edit}
                    isResizable={edit}
                    draggableCancel="input,textarea"
                >
                    {items.map(item => {
                        const itemClassNames = [
                            item.type,
                            edit ? 'edit' : 'view',
                        ].join(' ');

                        return (
                            <div key={item.i} className={itemClassNames}>
                                {edit ? (
                                    <DeleteItemButton
                                        onClick={this.onRemoveItemWrapper(
                                            item.id
                                        )}
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

const mapStateToProps = (state, ownProps) => {
    const { fromSelected, fromEditDashboard, fromDashboards } = fromReducers;

    const selectedDashboard = ownProps.edit
        ? fromEditDashboard.sGetEditDashboard(state)
        : fromDashboards.sGetById(state, fromSelected.sGetSelectedId(state));

    const dashboardItems = ownProps.edit
        ? fromEditDashboard.sGetEditDashboardItems(state)
        : fromDashboards.sGetItems(state);

    return {
        isLoading:
            fromSelected.sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems,
    };
};

const mapDispatchToProps = {
    acUpdateDashboardLayout,
    acRemoveDashboardItem,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const validItems = orArray(stateProps.dashboardItems).filter(hasShape);

    return {
        ...dispatchProps,
        edit: ownProps.edit,
        isLoading: stateProps.isLoading,
        dashboardItems: validItems,
        onItemResize,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(ItemGrid);
