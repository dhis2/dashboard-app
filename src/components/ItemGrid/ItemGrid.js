import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import ReactGridLayout from 'react-grid-layout';
import { CircularLoader, ScreenCover } from '@dhis2/ui-core';

import {
    acUpdateDashboardLayout,
    acRemoveDashboardItem,
} from '../../actions/editDashboard';
import { Item } from '../Item/Item';
import { resize as pluginResize } from '../Item/VisualizationItem/plugin';
import { isVisualizationType } from '../../modules/itemTypes';
import {
    GRID_ROW_HEIGHT,
    GRID_COMPACT_TYPE,
    MARGIN,
    getGridColumns,
    hasShape,
    onItemResize,
    sortItemsByGridPosition,
} from './gridUtil';
import { orArray } from '../../modules/util';

import NoContentMessage from '../../widgets/NoContentMessage';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import './ItemGrid.css';
import { sGetSelectedId, sGetSelectedIsLoading } from '../../reducers/selected';
import {
    sGetEditDashboardRoot,
    sGetEditDashboardItems,
} from '../../reducers/editDashboard';
import {
    sGetDashboardById,
    sGetDashboardItems,
    sGetForceLoadAll,
} from '../../reducers/dashboards';
import ProgressiveLoadingContainer from '../Item/ProgressiveLoadingContainer';

// Component

const EXPANDED_HEIGHT = 17;
// this is set in the .dashboard-item-content css
export const ITEM_CONTENT_PADDING_BOTTOM = 4;
export class ItemGrid extends Component {
    state = {
        expandedItems: {},
    };

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
        if (dashboardItem && isVisualizationType(dashboardItem)) {
            pluginResize(dashboardItem);
        }
    };

    onRemoveItemWrapper = id => () => this.onRemoveItem(id);

    adjustHeightForExpanded = dashboardItem => {
        const expandedItem = this.state.expandedItems[dashboardItem.id];

        if (expandedItem && expandedItem === true) {
            return Object.assign({}, dashboardItem, {
                h: dashboardItem.h + EXPANDED_HEIGHT,
            });
        }

        return dashboardItem;
    };

    getItemComponent = item => {
        const itemClassNames = [
            item.type,
            this.props.edit ? 'edit' : 'view',
        ].join(' ');

        return (
            <div key={item.i}>
                <ProgressiveLoadingContainer
                    key={item.i}
                    className={itemClassNames}
                    forceLoad={this.props.forceLoadAll}
                >
                    <Item
                        item={item}
                        editMode={this.props.edit}
                        onToggleItemExpanded={this.onToggleItemExpanded}
                    />
                </ProgressiveLoadingContainer>
            </div>
        );
    };

    getItemComponents = items => items.map(item => this.getItemComponent(item));

    render() {
        const { edit, isLoading, dashboardItems } = this.props;

        if (!isLoading && !dashboardItems.length) {
            return (
                <NoContentMessage
                    text={i18n.t('There are no items on this dashboard')}
                />
            );
        }

        const unsortedItems = edit
            ? dashboardItems
            : dashboardItems.map(this.adjustHeightForExpanded);

        //Sort the items by position, for printing one item per page
        const items = sortItemsByGridPosition(unsortedItems);

        return (
            <div className="grid-wrapper">
                {isLoading ? (
                    <ScreenCover>
                        <CircularLoader />
                    </ScreenCover>
                ) : null}
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
                    {this.getItemComponents(items)}
                </ReactGridLayout>
            </div>
        );
    }
}

ItemGrid.propTypes = {
    acRemoveDashboardItem: PropTypes.func,
    acUpdateDashboardLayout: PropTypes.func,
    dashboardItems: PropTypes.array,
    edit: PropTypes.bool,
    forceLoadAll: PropTypes.bool,
    isLoading: PropTypes.bool,
};

ItemGrid.defaultProps = {
    dashboardItems: [],
};

// Container

const mapStateToProps = (state, ownProps) => {
    const selectedDashboard = ownProps.edit
        ? sGetEditDashboardRoot(state)
        : sGetDashboardById(state, sGetSelectedId(state));

    const dashboardItems = ownProps.edit
        ? sGetEditDashboardItems(state)
        : sGetDashboardItems(state);

    return {
        isLoading: sGetSelectedIsLoading(state) || !selectedDashboard,
        dashboardItems,
        forceLoadAll: sGetForceLoadAll(state),
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
        forceLoadAll: stateProps.forceLoadAll,
        onItemResize,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(ItemGrid);
