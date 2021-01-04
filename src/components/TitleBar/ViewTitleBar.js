import React, { useState, createRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import { Button, FlyoutMenu, Popover, MenuItem, colors } from '@dhis2/ui'

import { useWindowDimensions } from '../WindowDimensionsProvider'
import { ThreeDots } from '../Item/VisualizationItem/assets/icons'
import { orObject } from '../../modules/util'
import { tStarDashboard } from '../../actions/dashboards'
import { tUpdateShowDescription } from '../../actions/selected'
import FilterSelector from '../ItemFilter/FilterSelector'
import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
    EMPTY_DASHBOARD,
} from '../../reducers/dashboards'
import isSmallScreen from '../../modules/isSmallScreen'

import classes from './styles/ViewTitleBar.module.css'

const ViewTitleBar = (props, context) => {
    const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false)
    const [sharingDialogIsOpen, setSharingDialogIsOpen] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState(null)
    const { width } = useWindowDimensions()

    const {
        id,
        name,
        description,
        access,
        style,
        showDescription,
        starred,
        onToggleStarredDashboard,
        onShowHideDescription,
    } = props

    const toggleSharingDialog = () =>
        setSharingDialogIsOpen(!sharingDialogIsOpen)

    const toggleMoreOptions = () => setMoreOptionsIsOpen(!moreOptionsIsOpen)

    const printLayout = () => setRedirectUrl(`${id}/printlayout`)
    const printOipp = () => setRedirectUrl(`${id}/printoipp`)

    const titleStyle = Object.assign({}, style.title, {
        cursor: 'default',
        userSelect: 'text',
        top: '7px',
    })

    const StarIcon = starred ? Star : StarBorder

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    const showHideDescriptionLabel = showDescription
        ? i18n.t('Hide description')
        : i18n.t('Show description')

    const showHideDescription = () => {
        onShowHideDescription()
        toggleMoreOptions()
    }

    const toggleStarredDashboardLabel = starred
        ? i18n.t('Unstar dashboard')
        : i18n.t('Star dashboard')

    const toggleStarredDashboard = () => {
        onToggleStarredDashboard()
        toggleMoreOptions()
    }

    const buttonRef = createRef()

    const userAccess = orObject(access)

    return (
        <>
            <div className={classes.titleBar}>
                <span style={titleStyle} data-test="view-dashboard-title">
                    {name}
                </span>
                <div className={classes.actions}>
                    <div
                        className={classes.titleBarIcon}
                        onClick={onToggleStarredDashboard}
                    >
                        <StarIcon style={{ fill: colors.grey600 }} />
                    </div>
                    <div className={classes.strip}>
                        {userAccess.update ? (
                            <Link
                                className={classes.editLink}
                                to={`/${id}/edit`}
                                data-test="link-edit-dashboard"
                            >
                                <Button>{i18n.t('Edit')}</Button>
                            </Link>
                        ) : null}
                        {userAccess.manage ? (
                            <Button
                                className={classes.shareButton}
                                onClick={toggleSharingDialog}
                            >
                                {i18n.t('Share')}
                            </Button>
                        ) : null}
                        <FilterSelector />
                        <span ref={buttonRef}>
                            <Button
                                small={isSmallScreen(width)}
                                dataTest="more-button"
                                onClick={toggleMoreOptions}
                            >
                                <ThreeDots />
                                <span style={{ marginLeft: '5px' }}>
                                    {i18n.t('More')}
                                </span>
                            </Button>
                        </span>
                    </div>
                    {moreOptionsIsOpen && (
                        <Popover
                            reference={buttonRef}
                            placement="bottom-start"
                            onClickOutside={toggleMoreOptions}
                        >
                            <FlyoutMenu>
                                <MenuItem
                                    dense
                                    label={toggleStarredDashboardLabel}
                                    onClick={toggleStarredDashboard}
                                />
                                <MenuItem
                                    dense
                                    label={showHideDescriptionLabel}
                                    onClick={showHideDescription}
                                />
                                <MenuItem
                                    dense
                                    label={i18n.t('Print')}
                                    dataTest="print-menu-item"
                                >
                                    <MenuItem
                                        dense
                                        label={i18n.t('Dashboard layout')}
                                        onClick={printLayout}
                                        dataTest="print-layout-menu-item"
                                    />
                                    <MenuItem
                                        dense
                                        label={i18n.t('One item per page')}
                                        onClick={printOipp}
                                        dataTest="print-oipp-menu-item"
                                    />
                                </MenuItem>
                            </FlyoutMenu>
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
                    {description || i18n.t('No description')}
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
    onShowHideDescription: PropTypes.func,
    onToggleStarredDashboard: PropTypes.func,
}

ViewTitleBar.defaultProps = {
    name: '',
    description: '',
    starred: false,
    showDescription: false,
}

ViewTitleBar.contextTypes = {
    d2: PropTypes.object,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = sGetDashboardById(state, id) || EMPTY_DASHBOARD

    return {
        id,
        name: dashboard.displayName,
        description: dashboard.displayDescription,
        dashboardItems: sGetDashboardItems(state),
        showDescription: sGetSelectedShowDescription(state),
        starred: dashboard.starred,
        access: dashboard.access,
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { id, starred, showDescription } = stateProps
    const { dispatch } = dispatchProps

    return {
        ...stateProps,
        ...ownProps,
        onToggleStarredDashboard: () => dispatch(tStarDashboard(id, !starred)),
        onShowHideDescription: () =>
            dispatch(tUpdateShowDescription(!showDescription)),
    }
}

export default connect(mapStateToProps, null, mergeProps)(ViewTitleBar)
