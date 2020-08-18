import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FilterBadge from './FilterBadge'

import { sGetNamedItemFilters } from '../../reducers/itemFilters'
import { sGetControlBarUserRows } from '../../reducers/controlBar'
import { getControlBarHeight } from '../ControlBar/controlBarDimensions'
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
        const { filters, userRows } = this.props

        const top = getControlBarHeight(userRows) + 10

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
        ) : null
    }
}

FilterBar.propTypes = {
    filters: PropTypes.array.isRequired,
    removeItemFilter: PropTypes.func.isRequired,
    setActiveModalDimension: PropTypes.func,
    userRows: PropTypes.number,
}

FilterBar.defaultProps = {
    filters: [],
    removeItemFIlter: Function.prototype,
}

const mapStateToProps = state => ({
    filters: sGetNamedItemFilters(state),
    userRows: sGetControlBarUserRows(state),
})

export default connect(mapStateToProps, {
    setActiveModalDimension: acSetActiveModalDimension,
    removeItemFilter: acRemoveItemFilter,
})(FilterBar)
