import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';

import { sGetDimensions } from '../../reducers/dimensions';
import { sGetItemFiltersRoot } from '../../reducers/itemFilters';
import { acRemoveItemFilter } from '../../actions/itemFilters';
import { acRemoveEditItemFilter } from '../../actions/editItemFilters';

import FilterBadge from './FilterBadge';

const styles = {
    bar: {
        position: 'sticky',
        top: 130,
        zIndex: 9000,
        padding: '8px 0',
        display: 'flex',
        justifyContent: 'center',
    },
};

export class FilterBar extends Component {
    onRemove = id => {
        this.props.removeItemFilter(id);
        this.props.removeEditItemFilter(id);
    };

    render() {
        const { filters } = this.props;

        return filters.length ? (
            <div style={styles.bar}>
                {filters.map(filter => (
                    <FilterBadge
                        key={filter.id}
                        data={filter}
                        onRemove={this.onRemove}
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
        removeItemFilter: acRemoveItemFilter,
        removeEditItemFilter: acRemoveEditItemFilter,
    }
)(FilterBar);
