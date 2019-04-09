import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';

import { sGetDimensions } from '../../reducers/dimensions';
import { sGetItemFiltersRoot } from '../../reducers/itemFilters';
import { acRemoveItemFilter } from '../../actions/itemFilters';
import { acRemoveEditItemFilter } from '../../actions/editItemFilters';
import { acSetActiveModalDimension } from '../../actions/activeModalDimension';

import FilterBadge from './FilterBadge';

const styles = {
    bar: {
        position: 'sticky',
        top: 130,
        zIndex: 7,
        padding: '8px 0',
        display: 'flex',
        justifyContent: 'center',
    },
};

export class FilterBar extends Component {
    onBadgeRemove = id => {
        this.props.removeItemFilter(id);
        this.props.removeEditItemFilter(id);
    };

    onBadgeClick = id => {
        this.props.setActiveModalDimension({
            id,
            name: this.props.filters.find(item => item.id === id).name,
        });
    };

    render() {
        const { filters } = this.props;

        return filters.length ? (
            <div style={styles.bar}>
                {filters.map(filter => (
                    <FilterBadge
                        key={filter.id}
                        data={filter}
                        onClick={this.onBadgeClick}
                        onRemove={this.onBadgeRemove}
                    />
                ))}
            </div>
        ) : null;
    }
}

FilterBar.propTypes = {
    filters: PropTypes.array.isRequired,
    removeItemFilter: PropTypes.func.isRequired,
    removeEditItemFilter: PropTypes.func.isRequired,
};

FilterBar.defaultProps = {
    filters: [],
    removeItemFIlter: Function.prototype,
    removeEditItemFilter: Function.prototype,
};

// simplify the filters structure to:
// [{ id: 'pe', name: 'Period', values: [{ id: 2019: name: '2019' }, {id: 'LAST_MONTH', name: 'Last month' }]}, ...]
const filtersSelector = createSelector(
    [sGetItemFiltersRoot, sGetDimensions],
    (filters, dimensions) =>
        Object.keys(filters).reduce((arr, id) => {
            arr.push({
                id: id,
                name: dimensions[id].name,
                values: filters[id].map(value => ({
                    id: value.id,
                    name: value.displayName || value.name,
                })),
            });

            return arr;
        }, [])
);

const mapStateToProps = state => ({
    filters: filtersSelector(state),
});

export default connect(
    mapStateToProps,
    {
        setActiveModalDimension: acSetActiveModalDimension,
        removeItemFilter: acRemoveItemFilter,
        removeEditItemFilter: acRemoveEditItemFilter,
    }
)(FilterBar);
