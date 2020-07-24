import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'

import { orObject } from '../../modules/util'
import { tStarDashboard } from '../../actions/dashboards'
import { acSetSelectedShowDescription } from '../../actions/selected'
import FilterSelector from '../ItemFilter/FilterSelector'
import { Button, colors } from '@dhis2/ui'
import Info from './Info'
import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'

import classes from './styles/ViewTitleBar.module.css'

const NO_DESCRIPTION = i18n.t('No description')

class ViewTitleBar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sharingDialogIsOpen: false,
        }
    }

    toggleSharingDialog = () =>
        this.setState({ sharingDialogIsOpen: !this.state.sharingDialogIsOpen })

    render() {
        const {
            id,
            name,
            description,
            access,
            showDescription,
            starred,
            onStarClick,
            onInfoClick,
        } = this.props

        const StarIcon = starred ? Star : StarBorder

        return (
            <div
                style={{
                    padding: '20px 15px 5px 10px',
                }}
            >
                <div className={classes.titleBar}>
                    <span className={classes.title}>{name}</span>
                    <div className={classes.actions}>
                        <div
                            className={classes.titleBarIcon}
                            onClick={onStarClick}
                        >
                            <StarIcon style={{ fill: colors.grey600 }} />
                        </div>
                        <div className={classes.titleBarIcon}>
                            <Info onClick={onInfoClick} />
                        </div>
                        <div style={{ marginLeft: '10px' }}>
                            {access.update ? (
                                <Link
                                    className={classes.editLink}
                                    to={`/${id}/edit`}
                                >
                                    <Button>{i18n.t('Edit')}</Button>
                                </Link>
                            ) : null}
                            {access.manage ? (
                                <span style={{ marginRight: '4px' }}>
                                    <Button onClick={this.toggleSharingDialog}>
                                        {i18n.t('Share')}
                                    </Button>
                                </span>
                            ) : null}
                            <span style={{ marginRight: '4px' }}>
                                <FilterSelector />
                            </span>
                            <Link
                                className={classes.editLink}
                                to={`/${id}/printlayout`}
                            >
                                <Button>{i18n.t('Print layout')}</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                {showDescription ? (
                    <div
                        className={classes.description}
                        style={!description ? { color: '#888' } : {}}
                    >
                        {description || NO_DESCRIPTION}
                    </div>
                ) : null}
                {id ? (
                    <SharingDialog
                        d2={this.context.d2}
                        id={id}
                        type="dashboard"
                        open={this.state.sharingDialogIsOpen}
                        onRequestClose={this.toggleSharingDialog}
                    />
                ) : null}
            </div>
        )
    }
}

ViewTitleBar.propTypes = {
    access: PropTypes.object,
    description: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    showDescription: PropTypes.bool,
    starred: PropTypes.bool,
    onInfoClick: PropTypes.func,
    onStarClick: PropTypes.func,
}

ViewTitleBar.defaultProps = {
    name: '',
    description: '',
    starred: false,
    showDescription: false,
    onInfoClick: null,
}

ViewTitleBar.contextTypes = {
    d2: PropTypes.object,
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
        starred: dashboard.starred,
        access: orObject(dashboard.access),
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { id, starred, showDescription } = stateProps
    const { dispatch } = dispatchProps

    return {
        ...stateProps,
        ...ownProps,
        onStarClick: () => dispatch(tStarDashboard(id, !starred)),
        onInfoClick: () =>
            dispatch(acSetSelectedShowDescription(!showDescription)),
    }
}

export default connect(mapStateToProps, null, mergeProps)(ViewTitleBar)
