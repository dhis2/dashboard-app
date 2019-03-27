import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Popover from '@material-ui/core/Popover';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import i18n from '@dhis2/d2-i18n';
import { DimensionsPanel } from '@dhis2/d2-ui-analytics';

import FlatButton from '../../widgets/FlatButton';
import FilterDialog from './FilterDialog';

import { sGetDimensions } from '../../reducers/dimensions';
import { sGetFiltersKeys } from '../../reducers/itemFilters';
import { sGetEditItemFiltersRoot } from '../../reducers/editItemFilters';
import { acSetItemFilters } from '../../actions/itemFilters';
import { acSetEditItemFilters } from '../../actions/editItemFilters';

class FilterSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            dimension: {},
        };
    }

    openPanel = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    closePanel = () => {
        this.setState({ anchorEl: null });
    };

    closeDialog = () => {
        this.setState({ dimension: null, anchorEl: null });
    };

    selectDimension = id => {
        this.setState({ dimension: this.props.dimensions[id] });
    };

    onSelectItems = ({ dimensionType: dimensionId, value: items }) => {
        console.log('onSelect', dimensionId, items);

        const oldList = this.props.selectedItems[dimensionId] || [];
        const newList = [
            ...oldList,
            ...items.filter(item => !oldList.find(i => i.id === item.id)),
        ];

        this.props.setEditItemFilters({
            ...this.props.selectedItems,
            [dimensionId]: newList,
        });
    };

    onDeselectItems = ({ dimensionType: dimensionId, value: idsToRemove }) => {
        console.log('onDeselect', idsToRemove);

        const newList = this.props.selectedItems[dimensionId].filter(
            item => !idsToRemove.includes(item.id)
        );
        console.log('new list', newList);
        this.props.setEditItemFilters({
            ...this.props.selectedItems,
            [dimensionId]: newList.length ? newList : undefined,
        });
    };

    onReorderItems = ({ dimensionType: dimensionId, value: ids }) => {
        console.log('onReorder', ids);

        const items = this.props.selectedItems[dimensionId];
        const reorderedList = ids.map(id => items.find(item => item.id === id));

        this.props.setEditItemFilters({
            ...this.props.selectedItems,
            [dimensionId]: reorderedList,
        });
    };

    saveFilter = () => {
        console.log('saveFilters', this.props.selectesItems);

        this.props.setItemFilters(this.props.selectedItems);

        this.closeDialog();
    };

    render() {
        const { dimensions, selectedDimensions, selectedItems } = this.props;
        const { dimension } = this.state;
        console.log('render selector', selectedDimensions, selectedItems);
        return (
            <Fragment>
                <FlatButton onClick={this.openPanel}>
                    {i18n.t('Add filter')}
                    <ArrowDropDownIcon />
                </FlatButton>
                <Popover
                    open={Boolean(this.state.anchorEl)}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    onClose={this.closePanel}
                    style={{ height: '100%' }}
                >
                    <DimensionsPanel
                        dimensions={dimensions}
                        onDimensionClick={this.selectDimension}
                        selectedIds={selectedDimensions}
                    />
                </Popover>
                {dimension ? (
                    <FilterDialog
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
    dimensions: sGetDimensions(state),
    selectedDimensions: sGetFiltersKeys(state),
    selectedItems: sGetEditItemFiltersRoot(state),
});

export default connect(
    mapStateToProps,
    {
        setItemFilters: acSetItemFilters,
        setEditItemFilters: acSetEditItemFilters,
    }
)(FilterSelector);
