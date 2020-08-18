import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { orObject } from '../../modules/util'

import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../reducers/selected'
import { sGetDashboardById } from '../../reducers/dashboards'
import { sGetNamedItemFilters } from '../../reducers/itemFilters'

import classes from './styles/PrintTitleBar.module.css'

class PrintTitleBar extends Component {
    render() {
        const { name, description, itemFilters, showDescription } = this.props

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
            <>
                <span className={classes.title}>{name}</span>
                {showDescription && description && (
                    <div className={classes.description}>{description}</div>
                )}
                {itemFilterString.length && (
                    <p className={classes.filters}>{itemFilterString}</p>
                )}
            </>
        )
    }
}

PrintTitleBar.propTypes = {
    description: PropTypes.string,
    itemFilters: PropTypes.array,
    name: PropTypes.string,
    showDescription: PropTypes.bool,
}

PrintTitleBar.defaultProps = {
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

export default connect(mapStateToProps)(PrintTitleBar)
