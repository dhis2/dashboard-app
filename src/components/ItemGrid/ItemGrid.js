import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import ReactGridLayout from 'react-grid-layout';
import { CircularProgress, ScreenCover } from '@dhis2/ui-core';

import {
    acUpdateDashboardLayout,
    acRemoveDashboardItem,
} from '../../actions/editDashboard';
import { Item } from '../Item/Item';
import { resize as pluginResize } from '../Item/VisualizationItem/plugin';
import { isPluginType } from '../../modules/itemTypes';
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
import DeleteItemButton from './DeleteItemButton';
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

export const ItemGrid = props => {
    const [expandedItems, setExpandedItems] = useState({});

    useEffect(() => {
        props.edit && setExpandedItems({});
    }, [props.edit]);

    const onToggleItemExpanded = clickedId => {
        const isExpanded =
            typeof expandedItems[clickedId] === 'boolean'
                ? expandedItems[clickedId]
                : false;

        const _expandedItems = { ...expandedItems };
        _expandedItems[clickedId] = !isExpanded;

        setExpandedItems(_expandedItems);
    };

    const onRemoveItem = clickedId => {
        props.acRemoveDashboardItem(clickedId);
    };

    const onLayoutChange = newLayout =>
        props.edit && props.acUpdateDashboardLayout(newLayout);

    const onResizeStop = (layout, oldItem, newItem) => {
        onItemResize(newItem.i);

        const dashboardItem = props.dashboardItems.find(
            item => item.id === newItem.i
        );

        // call resize on the item component if it's a plugin type
        if (dashboardItem && isPluginType(dashboardItem)) {
            pluginResize(dashboardItem);
        }
    };

    const onRemoveItemWrapper = id => () => onRemoveItem(id);

    if (!props.isLoading && !props.dashboardItems.length) {
        return (
            <NoContentMessage
                text={i18n.t('There are no items on this dashboard')}
            />
        );
    }

    const items = props.dashboardItems.map(item => {
        const expandedItem = expandedItems[item.id];
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
            {props.isLoading ? (
                <ScreenCover>
                    <CircularProgress />
                </ScreenCover>
            ) : null}
            <ReactGridLayout
                onLayoutChange={onLayoutChange}
                onResizeStop={onResizeStop}
                className="layout"
                layout={items}
                margin={MARGIN}
                cols={getGridColumns()}
                rowHeight={GRID_ROW_HEIGHT}
                width={window.innerWidth}
                compactType={GRID_COMPACT_TYPE}
                isDraggable={props.edit}
                isResizable={props.edit}
                draggableCancel="input,textarea"
            >
                {items.map(item => {
                    const itemClassNames = [
                        item.type,
                        props.edit ? 'edit' : 'view',
                    ].join(' ');

                    return (
                        <ProgressiveLoadingContainer
                            key={item.i}
                            className={itemClassNames}
                        >
                            {props.edit ? (
                                <DeleteItemButton
                                    onClick={onRemoveItemWrapper(item.id)}
                                />
                            ) : null}
                            <Item
                                item={item}
                                editMode={props.edit}
                                onToggleItemExpanded={onToggleItemExpanded}
                            />
                        </ProgressiveLoadingContainer>
                    );
                })}
            </ReactGridLayout>
        </div>
    );
};

ItemGrid.propTypes = {
    dashboardItems: PropTypes.array,
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
