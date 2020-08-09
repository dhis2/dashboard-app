import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Link } from 'react-router-dom'
import { Button, colors } from '@dhis2/ui'

import { orObject } from '../../modules/util'

import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../reducers/selected'
import { sGetDashboardById } from '../../reducers/dashboards'

import classes from './styles/PrintTitleBar.module.css'

const style = {
    title: {
        position: 'relative',
        fontSize: 21,
        fontWeight: 500,
        color: colors.black,
        minWidth: 50,
    },
    description: {
        fontSize: 14,
        color: colors.grey800,
    },
}

class PrintTitleBar extends Component {
    render() {
        const { id, name, description, showDescription } = this.props

        const titleStyle = Object.assign({}, style.title, {
            cursor: 'default',
            userSelect: 'text',
            top: '7px',
        })

        return (
            <>
                <div className={classes.titleBar}>
                    <span style={titleStyle}>{name}</span>
                    <Link className={classes.link} to={`/${id}`}>
                        <Button>{i18n.t('Return to View')}</Button>
                    </Link>
                </div>
                {showDescription ? (
                    <div
                        className="dashboard-description"
                        style={Object.assign(
                            { paddingTop: '5px', paddingBottom: '5px' },
                            style.description,
                            !description ? { color: '#888' } : {}
                        )}
                    >
                        {description || i18n.t('No Description')}
                    </div>
                ) : null}
            </>
        )
    }
}

PrintTitleBar.propTypes = {
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
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
        id,
        name: dashboard.displayName,
        description: dashboard.displayDescription,
        showDescription: sGetSelectedShowDescription(state),
    }
}

export default connect(mapStateToProps)(PrintTitleBar)
