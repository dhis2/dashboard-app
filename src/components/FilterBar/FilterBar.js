import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FilterBadge from './FilterBadge'

import { sGetNamedItemFilters } from '../../reducers/itemFilters'
import { acRemoveItemFilter } from '../../actions/itemFilters'
import { acSetActiveModalDimension } from '../../actions/activeModalDimension'

import classes from './styles/FilterBar.module.css'

export class FilterBar extends Component {
    onBadgeRemove = id => {
        this.props.removeItemFilter(id)
    }

    onBadgeClick = id => {
        this.props.setActiveModalDimension({
            id,
            name: this.props.filters.find(item => item.id === id).name,
        })
    }

    render() {
        const { filters } = this.props

        return filters.length ? (
            // the 3 is calculated so that the FilterBar has the same vertical position as the TitleBar in relation to the ControlBar
            <div className={classes.bar} style={{ top: 3 }}>
                {filters.map(filter => (
                    <FilterBadge
                        key={filter.id}
                        data={filter}
                        onClick={this.onBadgeClick}
                        onRemove={this.onBadgeRemove}
                    />
                ))}
            </div>
        ) : null
    }
}

FilterBar.propTypes = {
    filters: PropTypes.array.isRequired,
    removeItemFilter: PropTypes.func.isRequired,
    setActiveModalDimension: PropTypes.func,
}

FilterBar.defaultProps = {
    filters: [],
    removeItemFIlter: Function.prototype,
}

const mapStateToProps = state => ({
    filters: sGetNamedItemFilters(state),
})

export default connect(mapStateToProps, {
    setActiveModalDimension: acSetActiveModalDimension,
    removeItemFilter: acRemoveItemFilter,
})(FilterBar)
