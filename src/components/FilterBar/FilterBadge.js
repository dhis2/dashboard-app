import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

import { acRemoveItemFilter } from '../../actions/itemFilters'
import { acSetActiveModalDimension } from '../../actions/activeModalDimension'

import classes from './styles/FilterBadge.module.css'

const FilterBadge = ({ filter, openFilterModal, removeFilter }) => (
    <div className={classes.container} data-test="dashboard-filter-badge">
        <span
            className={classes.badge}
            onClick={() =>
                openFilterModal({
                    id: filter.id,
                    name: filter.name,
                })
            }
        >
            {`${filter.name}: ${
                filter.values.length > 1
                    ? i18n.t('{{count}} selected', {
                          count: filter.values.length,
                      })
                    : filter.values[0].name
            }`}
        </span>
        <span
            className={classes.removeButton}
            onClick={() => removeFilter(filter.id)}
        >
            {i18n.t('Remove')}
        </span>
    </div>
)

FilterBadge.propTypes = {
    filter: PropTypes.object.isRequired,
    openFilterModal: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
}

export default connect(null, {
    openFilterModal: acSetActiveModalDimension,
    removeFilter: acRemoveItemFilter,
})(FilterBadge)
