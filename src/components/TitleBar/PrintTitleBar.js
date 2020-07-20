import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { orObject } from '../../modules/util'

import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'

import classes from './styles/PrintTitleBar.module.css'

const PrintTitleBar = props => {
    const { name, description, showDescription } = props

    return (
        <div
            style={{
                padding: '20px 15px 5px 10px',
            }}
        >
            <div className={classes.titleBar}>
                <span className={classes.title}>{name}</span>
            </div>
            {showDescription && description ? (
                <div className={classes.description}>{description}</div>
            ) : null}
        </div>
    )
}

PrintTitleBar.propTypes = {
    description: PropTypes.string,
    name: PropTypes.string,
    showDescription: PropTypes.bool,
}

PrintTitleBar.defaultProps = {
    name: '',
    description: '',
    showDescription: false,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = orObject(sGetDashboardById(state, id))

    return {
        id,
        name: dashboard.displayName,
        description: dashboard.displayDescription,
        dashboardItems: sGetDashboardItems(state),
        showDescription: sGetSelectedShowDescription(state),
    }
}

export default connect(mapStateToProps)(PrintTitleBar)
