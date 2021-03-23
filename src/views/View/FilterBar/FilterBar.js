import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FilterBadge from './FilterBadge'
import { sGetNamedItemFilters } from '../../../reducers/itemFilters'

import classes from './styles/FilterBar.module.css'

const FilterBar = ({ filters }) =>
    filters.length ? (
        <div className={classes.bar}>
            {filters.map(filter => (
                <FilterBadge key={filter.id} filter={filter} />
            ))}
        </div>
    ) : null

FilterBar.propTypes = {
    filters: PropTypes.array.isRequired,
}

FilterBar.defaultProps = {
    filters: [],
}

const mapStateToProps = state => ({
    filters: sGetNamedItemFilters(state),
})

export default connect(mapStateToProps)(FilterBar)
