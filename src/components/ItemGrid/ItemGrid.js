import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import memoize from 'lodash/memoize';
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
    ITEM_MIN_HEIGHT,
    MARGIN,
    getGridColumns,
    hasShape,
    onItemResize,
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
} from '../../reducers/dashboards';
import ProgressiveLoadingContainer from '../Item/ProgressiveLoadingContainer';

// Component

const EXPANDED_HEIGHT = 17;

export class ItemGrid extends Component {
    state = {
        expandedItems: {},
    };

    constructor(props) {
        super(props);

        this.getMemoizedItem = memoize(this.getItem);
        this.getMemoizedItems = memoize(this.getItems);
        this.getMemoizedItemComponent = memoize(this.getItemComponent);
        this.getMemoizedItemComponents = memoize(this.getItemComponents);
    }

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

    getItem = dashboardItem => {
        const expandedItem = this.state.expandedItems[dashboardItem.id];
        const hProp = { h: dashboardItem.h };

        if (expandedItem && expandedItem === true) {
            hProp.h = dashboardItem.h + EXPANDED_HEIGHT;
        }

        return Object.assign({}, dashboardItem, hProp, {
            i: dashboardItem.id,
            minH: ITEM_MIN_HEIGHT,
            randomNumber: Math.random(),
        });
    };

    getItems = dashboardItems =>
        dashboardItems.map(item => this.getMemoizedItem(item));

    getItemComponent = item => {
        const itemClassNames = [
            item.type,
            this.props.edit ? 'edit' : 'view',
        ].join(' ');

        return (
            <ProgressiveLoadingContainer
                key={item.i}
                className={itemClassNames}
            >
                <Item
                    item={item}
                    editMode={this.props.edit}
                    onToggleItemExpanded={this.onToggleItemExpanded}
                />
            </ProgressiveLoadingContainer>
        );
    };

    getItemComponents = items =>
        items.map(item => this.getMemoizedItemComponent(item));

    render() {
        const { edit, isLoading, dashboardItems } = this.props;

        if (!isLoading && !dashboardItems.length) {
            return (
                <NoContentMessage
                    text={i18n.t('There are no items on this dashboard')}
                />
            );
        }

        const items = edit
            ? this.getMemoizedItems(dashboardItems)
            : dashboardItems.map(this.getItem);

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
                    {this.getMemoizedItemComponents(items)}
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
