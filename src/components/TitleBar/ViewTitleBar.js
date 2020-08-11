import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'
import { Redirect } from 'react-router-dom'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import Popover from '@material-ui/core/Popover'
import { Button, Menu, MenuItem, colors } from '@dhis2/ui'

import { ThreeDots } from '../Item/VisualizationItem/assets/icons'
import { orObject } from '../../modules/util'
import { tStarDashboard } from '../../actions/dashboards'
import { acSetSelectedShowDescription } from '../../actions/selected'
import FilterSelector from '../ItemFilter/FilterSelector'
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

const ViewTitleBar = (props, context) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [sharingDialogIsOpen, setSharingDialogIsOpen] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState(null)

    const toggleSharingDialog = () =>
        setSharingDialogIsOpen(!sharingDialogIsOpen)

    const openMoreOptions = (_, event) => setAnchorEl(event.currentTarget)

    const closeMoreOptions = () => setAnchorEl(null)

    const printLayout = () => setRedirectUrl(`${props.id}/printlayout`)
    const printOipp = () => setRedirectUrl(`${props.id}/printoipp`)

    const {
        id,
        name,
        description,
        access,
        style,
        showDescription,
        starred,
        onStarClick,
        onInfoClick,
    } = props

    const titleStyle = Object.assign({}, style.title, {
        cursor: 'default',
        userSelect: 'text',
        top: '7px',
    })

    const StarIcon = starred ? Star : StarBorder

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    return (
        <>
            <div className={classes.titleBar}>
                <span style={titleStyle}>{name}</span>
                <div className={classes.actions}>
                    <div className={classes.titleBarIcon} onClick={onStarClick}>
                        <StarIcon style={{ fill: colors.grey600 }} />
                    </div>
                    <div className={classes.titleBarIcon}>
                        <Info onClick={onInfoClick} />
                    </div>
                    <div className={classes.strip}>
                        {access.update ? (
                            <Link
                                className={classes.editLink}
                                to={`/${id}/edit`}
                            >
                                <Button>{i18n.t('Edit')}</Button>
                            </Link>
                        ) : null}
                        {access.manage ? (
                            <Button onClick={toggleSharingDialog}>
                                {i18n.t('Share')}
                            </Button>
                        ) : null}
                        <FilterSelector />
                        <Button onClick={openMoreOptions}>
                            <ThreeDots />
                            <span style={{ marginLeft: '5px' }}>
                                {i18n.t('More')}
                            </span>
                        </Button>
                    </div>
                    {anchorEl && (
                        <Popover
                            open={Boolean(anchorEl)}
                            onClose={closeMoreOptions}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <Menu>
                                <MenuItem
                                    dense
                                    label={i18n.t('Print layout')}
                                    onClick={printLayout}
                                />
                                <MenuItem
                                    dense
                                    label={i18n.t('Print one item per page')}
                                    onClick={printOipp}
                                />
                            </Menu>
                        </Popover>
                    )}
                </div>
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
                    {description || NO_DESCRIPTION}
                </div>
            ) : null}
            {id ? (
                <SharingDialog
                    d2={context.d2}
                    id={id}
                    type="dashboard"
                    open={sharingDialogIsOpen}
                    onRequestClose={toggleSharingDialog}
                />
            ) : null}
        </>
    )
}

ViewTitleBar.propTypes = {
    access: PropTypes.object,
    description: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    showDescription: PropTypes.bool,
    starred: PropTypes.bool,
    style: PropTypes.object,
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
