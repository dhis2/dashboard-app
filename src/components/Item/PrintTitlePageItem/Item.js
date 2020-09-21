import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../../reducers/selected'
import {
    sGetDashboardById,
    EMPTY_DASHBOARD,
} from '../../../reducers/dashboards'
import { sGetNamedItemFilters } from '../../../reducers/itemFilters'

import classes from './styles/Item.module.css'

const PrintTitlePageItem = ({
    name,
    description,
    itemFilters,
    showDescription,
}) => {
    const getItemFilterList = () => {
        const listItems = itemFilters.map(({ name, values }) => (
            <li className={classes.filterListItem} key={name}>
                {name}: {values.map(val => val.name).join(', ')}
            </li>
        ))

        return <ul className={classes.filterList}>{listItems}</ul>
    }

    return (
        <div className={classes.titlePage}>
            <p className={classes.name}>{name}</p>
            {showDescription && description && (
                <p className={classes.description}>{description}</p>
            )}
            {itemFilters.length > 0 && (
                <>
                    <p className={classes.filterTitle}>
                        {i18n.t('Filters applied')}
                    </p>
                    {getItemFilterList()}
                </>
            )}
        </div>
    )
}

PrintTitlePageItem.propTypes = {
    description: PropTypes.string,
    itemFilters: PropTypes.array,
    name: PropTypes.string,
    showDescription: PropTypes.bool,
}

PrintTitlePageItem.defaultProps = {
    description: '',
    name: '',
    showDescription: false,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = sGetDashboardById(state, id) || EMPTY_DASHBOARD

    return {
        name: dashboard.displayName,
        itemFilters: sGetNamedItemFilters(state),
        description: dashboard.displayDescription,
        showDescription: sGetSelectedShowDescription(state),
    }
}

export default connect(mapStateToProps)(PrintTitlePageItem)
