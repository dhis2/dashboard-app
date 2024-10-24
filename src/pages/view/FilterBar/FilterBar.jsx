import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
    acRemoveItemFilter,
    acClearItemFilters,
} from '../../../actions/itemFilters.js'
import ConfirmActionDialog from '../../../components/ConfirmActionDialog.jsx'
import { sGetNamedItemFilters } from '../../../reducers/itemFilters.js'
import FilterBadge from './FilterBadge.jsx'
import classes from './styles/FilterBar.module.css'

const FilterBar = ({ filters, removeFilter, removeAllFilters }) => {
    const { isConnected: online } = useDhis2ConnectionStatus()
    const [dialogIsOpen, setDialogIsOpen] = useState(false)

    const onRemoveFilter = (filterId) => {
        if (!online && filters.length > 1) {
            setDialogIsOpen(true)
        } else {
            removeFilter(filterId)
        }
    }

    const closeDialog = () => setDialogIsOpen(false)

    return filters.length ? (
        <>
            <div className={classes.bar}>
                {filters.map((filter) => (
                    <FilterBadge
                        key={filter.id}
                        filter={filter}
                        onRemove={onRemoveFilter}
                    />
                ))}
            </div>
            <ConfirmActionDialog
                open={dialogIsOpen}
                title={i18n.t('Removing filters while offline')}
                message={i18n.t(
                    'Removing this filter while offline will remove all other filters. Do you want to remove all filters on this dashboard?'
                )}
                cancelLabel={i18n.t('No, cancel')}
                confirmLabel={i18n.t('Yes, remove filters')}
                onConfirm={removeAllFilters}
                onCancel={closeDialog}
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

const mapStateToProps = (state) => ({
    filters: sGetNamedItemFilters(state),
})

export default connect(mapStateToProps, {
    removeAllFilters: acClearItemFilters,
    removeFilter: acRemoveItemFilter,
})(FilterBar)
