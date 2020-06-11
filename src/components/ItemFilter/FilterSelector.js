import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import i18n from '@dhis2/d2-i18n';
import { DimensionsPanel } from '@dhis2/analytics';

import { Button, Popover } from '@dhis2/ui';
import FilterDialog from './FilterDialog';

import { sGetSettingsDisplayNameProperty } from '../../reducers/settings';
import { sGetActiveModalDimension } from '../../reducers/activeModalDimension';
import { sGetDimensions } from '../../reducers/dimensions';
import { sGetFiltersKeys } from '../../reducers/itemFilters';
import { sGetEditItemFiltersRoot } from '../../reducers/editItemFilters';
import { acAddItemFilter, acRemoveItemFilter } from '../../actions/itemFilters';
import {
    acRemoveEditItemFilter,
    acSetEditItemFilters,
} from '../../actions/editItemFilters';
import {
    acClearActiveModalDimension,
    acSetActiveModalDimension,
} from '../../actions/activeModalDimension';

const FilterSelector = props => {
    const [showPopover, setShowPopover] = useState(false);
    const ref = useRef(null);

    const closePanel = () => setShowPopover(false);

    const onCloseDialog = () => {
        closePanel();

        props.clearActiveModalDimension();
    };

    const selectDimension = id => {
        props.setActiveModalDimension(
            props.dimensions.find(dimension => dimension.id === id)
        );
    };

    const onSelectItems = ({ dimensionId, items }) => {
        props.setEditItemFilters({
            ...props.selectedItems,
            [dimensionId]: items,
        });
    };

    const onDeselectItems = ({ dimensionId, itemIdsToRemove }) => {
        const oldList = props.selectedItems[dimensionId] || [];
        const newList = oldList.filter(
            item => !itemIdsToRemove.includes(item.id)
        );

        if (newList.length) {
            props.setEditItemFilters({
                ...props.selectedItems,
                [dimensionId]: newList,
            });
        } else {
            props.removeEditItemFilter(dimensionId);
        }
    };

    const onReorderItems = ({ dimensionId, itemIds }) => {
        const oldList = props.selectedItems[dimensionId] || [];
        const reorderedList = itemIds.map(id =>
            oldList.find(item => item.id === id)
        );

        props.setEditItemFilters({
            ...props.selectedItems,
            [dimensionId]: reorderedList,
        });
    };

    const saveFilter = id => {
        const filterItems = props.selectedItems[id];

        if (filterItems && filterItems.length) {
            props.addItemFilter({
                id,
                value: [...filterItems],
            });
        } else {
            props.removeItemFilter(id);
        }

        onCloseDialog();
    };

    return (
        <>
            <span ref={ref}>
                <Button onClick={() => setShowPopover(true)}>
                    {i18n.t('Add filter')}
                    <ArrowDropDownIcon />
                </Button>
            </span>
            {showPopover && (
                <Popover
                    onClickOutside={closePanel}
                    reference={ref}
                    arrow={true}
                    placement="bottom-start"
                >
                    <DimensionsPanel
                        style={{ width: '320px' }}
                        dimensions={props.dimensions}
                        onDimensionClick={selectDimension}
                        selectedIds={props.selectedDimensions}
                    />
                </Popover>
            )}
            {props.dimension ? (
                <FilterDialog
                    displayNameProperty={props.displayNameProperty}
                    dimension={props.dimension}
                    selectedItems={
                        props.selectedItems[props.dimension.id] || []
                    }
                    onSelect={onSelectItems}
                    onDeselect={onDeselectItems}
                    onReorder={onReorderItems}
                    onClose={onCloseDialog}
                    onConfirm={saveFilter}
                />
            ) : null}
        </>
    );
};

const mapStateToProps = state => ({
    displayNameProperty: sGetSettingsDisplayNameProperty(state),
    dimension: sGetActiveModalDimension(state),
    dimensions: sGetDimensions(state),
    selectedDimensions: sGetFiltersKeys(state),
    selectedItems: sGetEditItemFiltersRoot(state),
});

FilterSelector.propTypes = {
    addItemFilter: PropTypes.func,
    clearActiveModalDimension: PropTypes.func,
    dimension: PropTypes.object,
    dimensions: PropTypes.array,
    displayNameProperty: PropTypes.string,
    removeEditItemFilter: PropTypes.func,
    removeItemFilter: PropTypes.func,
    selectedDimensions: PropTypes.array,
    selectedItems: PropTypes.object,
    setActiveModalDimension: PropTypes.func,
    setEditItemFilters: PropTypes.func,
};

export default connect(mapStateToProps, {
    clearActiveModalDimension: acClearActiveModalDimension,
    setActiveModalDimension: acSetActiveModalDimension,
    addItemFilter: acAddItemFilter,
    removeItemFilter: acRemoveItemFilter,
    removeEditItemFilter: acRemoveEditItemFilter,
    setEditItemFilters: acSetEditItemFilters,
})(FilterSelector);
