import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { orObject } from '../../../modules/util'

import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../../reducers/selected'
import { sGetDashboardById } from '../../../reducers/dashboards'
import { sGetNamedItemFilters } from '../../../reducers/itemFilters'

import classes from './styles/Item.module.css'

const PrintTitlePageItem = ({
    name,
    description,
    itemFilters,
    showDescription,
}) => {
    let itemFilterString = ''
    if (itemFilters.length) {
        const tmp = itemFilters
            .map(({ name, values }) => {
                const filterItems = values.map(val => val.name).join(', ')
                return `${name}: ${filterItems}`
            })
            .join('; ')

        itemFilterString =
            itemFilters.length === 1
                ? `${tmp} applied as filter`
                : `${tmp} applied as filters`
    }

    return (
        <div className={classes.container}>
            <span className={classes.title}>{name}</span>
            {showDescription && description && (
                <p className={classes.description}>{description}</p>
            )}
            {itemFilterString.length > 0 && (
                <p className={classes.filters}>{itemFilterString}</p>
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
    const dashboard = orObject(sGetDashboardById(state, id))

    return {
        name: dashboard.displayName,
        itemFilters: sGetNamedItemFilters(state),
        description: dashboard.displayDescription,
        showDescription: sGetSelectedShowDescription(state),
    }
}

export default connect(mapStateToProps)(PrintTitlePageItem)
