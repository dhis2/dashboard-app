import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useOnlineStatus } from '../../../modules/useOnlineStatus'

import FilterBadge from './FilterBadge'
import ConfirmActionDialog, {
    ACTION_CLEAR_ALL_FILTERS,
} from '../../../components/ConfirmActionDialog'

import { sGetNamedItemFilters } from '../../../reducers/itemFilters'
import {
    acRemoveItemFilter,
    acClearItemFilters,
} from '../../../actions/itemFilters'

import classes from './styles/FilterBar.module.css'

const FilterBar = ({ filters, removeFilter, removeAllFilters }) => {
    const { isOnline } = useOnlineStatus()
    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    const onRemoveFilter = filterId => {
        if (!isOnline && filters.length > 1) {
            setDialogIsOpen(true)
        } else {
            removeFilter(filterId)
        }
    }

    const closeDialog = () => setDialogIsOpen(false)

    return filters.length ? (
        <>
            <div className={classes.bar}>
                {filters.map(filter => (
                    <FilterBadge
                        key={filter.id}
                        filter={filter}
                        onRemove={onRemoveFilter}
                    />
                ))}
            </div>
            <ConfirmActionDialog
                action={ACTION_CLEAR_ALL_FILTERS}
                onConfirm={removeAllFilters}
                onCancel={closeDialog}
                open={dialogIsOpen}
            />
        </>
    ) : null
}

FilterBar.propTypes = {
    filters: PropTypes.array.isRequired,
    removeAllFilters: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
}

FilterBar.defaultProps = {
    filters: [],
}

const mapStateToProps = state => ({
    filters: sGetNamedItemFilters(state),
})

export default connect(mapStateToProps, {
    removeAllFilters: acClearItemFilters,
    removeFilter: acRemoveItemFilter,
})(FilterBar)
