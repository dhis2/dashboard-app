import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';

import { sGetDimensions } from '../../reducers/dimensions';
import { sGetItemFiltersRoot } from '../../reducers/itemFilters';
import { sGetControlBarUserRows } from '../../reducers/controlBar';
import { getTopOffset } from '../ControlBar/controlBarDimensions';
import { acRemoveItemFilter } from '../../actions/itemFilters';
import { acRemoveEditItemFilter } from '../../actions/editItemFilters';
import { acSetActiveModalDimension } from '../../actions/activeModalDimension';

import FilterBadge from './FilterBadge';

const styles = {
    bar: {
        position: 'sticky',
        zIndex: 7,
        padding: '8px 0',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
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
        const { filters, userRows, classes } = this.props;
        const top = getTopOffset(userRows) + 10;

        return filters.length ? (
            <div className={classes.bar} style={{ top }}>
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
    userRows: sGetControlBarUserRows(state),
});

export default connect(
    mapStateToProps,
    {
        setActiveModalDimension: acSetActiveModalDimension,
        removeItemFilter: acRemoveItemFilter,
        removeEditItemFilter: acRemoveEditItemFilter,
    }
)(withStyles(styles)(FilterBar));
