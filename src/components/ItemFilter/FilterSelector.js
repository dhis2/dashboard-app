import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Popover from '@material-ui/core/Popover';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { withTheme } from '@material-ui/core/styles';

import i18n from '@dhis2/d2-i18n';
import { DimensionsPanel } from '@dhis2/d2-ui-analytics';

import { Button } from '@dhis2/ui-core';
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

class FilterSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        };
    }

    openPanel = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    closePanel = () => {
        this.setState({ anchorEl: null });
    };

    closeDialog = () => {
        this.setState({ anchorEl: null });

        this.props.clearActiveModalDimension();
    };

    selectDimension = id => {
        this.props.setActiveModalDimension({
            id,
            name: this.props.dimensions[id].name,
        });
    };

    onSelectItems = ({ dimensionId, items }) => {
        this.props.setEditItemFilters({
            ...this.props.selectedItems,
            [dimensionId]: items,
        });
    };

    onDeselectItems = ({ dimensionId, itemIdsToRemove }) => {
        const oldList = this.props.selectedItems[dimensionId] || [];
        const newList = oldList.filter(
            item => !itemIdsToRemove.includes(item.id)
        );

        if (newList.length) {
            this.props.setEditItemFilters({
                ...this.props.selectedItems,
                [dimensionId]: newList,
            });
        } else {
            this.props.removeEditItemFilter(dimensionId);
        }
    };

    onReorderItems = ({ dimensionId, itemIds }) => {
        const oldList = this.props.selectedItems[dimensionId] || [];
        const reorderedList = itemIds.map(id =>
            oldList.find(item => item.id === id)
        );

        this.props.setEditItemFilters({
            ...this.props.selectedItems,
            [dimensionId]: reorderedList,
        });
    };

    saveFilter = id => {
        const filterItems = this.props.selectedItems[id];

        if (filterItems && filterItems.length) {
            this.props.addItemFilter({
                id,
                value: [...filterItems],
            });
        } else {
            this.props.removeItemFilter(id);
        }

        this.closeDialog();
    };

    render() {
        const {
            theme,
            displayNameProperty,
            dimension,
            dimensions,
            selectedDimensions,
            selectedItems,
        } = this.props;

        return (
            <Fragment>
                <Button onClick={this.openPanel}>
                    {i18n.t('Add filter')}
                    <ArrowDropDownIcon />
                </Button>
                <Popover
                    open={Boolean(this.state.anchorEl)}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    onClose={this.closePanel}
                    style={{
                        height: '100%',
                        fontFamily: theme.typography.fontFamily,
                    }}
                >
                    <DimensionsPanel
                        dimensions={dimensions}
                        onDimensionClick={this.selectDimension}
                        selectedIds={selectedDimensions}
                    />
                </Popover>
                {dimension ? (
                    <FilterDialog
                        displayNameProperty={displayNameProperty}
                        dimension={dimension}
                        selectedItems={selectedItems[dimension.id] || []}
                        onSelect={this.onSelectItems}
                        onDeselect={this.onDeselectItems}
                        onReorder={this.onReorderItems}
                        onClose={this.closeDialog}
                        onConfirm={this.saveFilter}
                    />
                ) : null}
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    displayNameProperty: sGetSettingsDisplayNameProperty(state),
    dimension: sGetActiveModalDimension(state),
    dimensions: sGetDimensions(state),
    selectedDimensions: sGetFiltersKeys(state),
    selectedItems: sGetEditItemFiltersRoot(state),
});

export default connect(
    mapStateToProps,
    {
        clearActiveModalDimension: acClearActiveModalDimension,
        setActiveModalDimension: acSetActiveModalDimension,
        addItemFilter: acAddItemFilter,
        removeItemFilter: acRemoveItemFilter,
        removeEditItemFilter: acRemoveEditItemFilter,
        setEditItemFilters: acSetEditItemFilters,
    }
)(withTheme()(FilterSelector));
