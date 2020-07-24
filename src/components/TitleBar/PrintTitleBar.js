import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

import { orObject } from '../../modules/util'

import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../reducers/selected'
import { sGetDashboardById } from '../../reducers/dashboards'

import classes from './styles/PrintTitleBar.module.css'

const PrintTitleBar = props => {
    const { id, name, description, showDescription } = props

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
            <Link className={classes.editLink} to={`/${id}`}>
                <Button>{i18n.t('Return to View')}</Button>
            </Link>
        </div>
    )
}

PrintTitleBar.propTypes = {
    id: PropTypes.string.isRequired,
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
        showDescription: sGetSelectedShowDescription(state),
    }
}

export default connect(mapStateToProps)(PrintTitleBar)
