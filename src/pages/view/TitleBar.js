import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Link, Redirect } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import {
    Button,
    DropdownButton,
    FlyoutMenu,
    MenuItem,
    Tooltip,
    colors,
    IconMore24,
    IconStar24,
    IconStarFilled24,
} from '@dhis2/ui'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'

import { orObject } from '../../modules/util'
import { apiStarDashboard } from './starDashboard'
import { apiPostShowDescription } from '../../api/description'

import { acSetDashboardStarred } from '../../actions/dashboards'
import { acSetSelectedShowDescription } from '../../actions/selected'
import FilterSelector from './ItemFilter/FilterSelector'
import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
    EMPTY_DASHBOARD,
} from '../../reducers/dashboards'

import classes from './styles/TitleBar.module.css'

const ViewTitleBar = ({
    id,
    name,
    description,
    access,
    showDescription,
    starred,
    setDashboardStarred,
    updateShowDescription,
    restrictFilters,
    allowedFilters,
}) => {
    const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false)
    const [sharingDialogIsOpen, setSharingDialogIsOpen] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState(null)
    const { d2 } = useD2()
    const dataEngine = useDataEngine()

    const warningAlert = useAlert(({ msg }) => msg, {
        warning: true,
    })

    const toggleSharingDialog = () =>
        setSharingDialogIsOpen(!sharingDialogIsOpen)

    const toggleMoreOptions = () => setMoreOptionsIsOpen(!moreOptionsIsOpen)

    const printLayout = () => setRedirectUrl(`${id}/printlayout`)
    const printOipp = () => setRedirectUrl(`${id}/printoipp`)

    const StarIcon = starred ? IconStarFilled24 : IconStar24

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    const showHideDescriptionLabel = showDescription
        ? i18n.t('Hide description')
        : i18n.t('Show description')

    const onToggleShowDescription = () =>
        apiPostShowDescription(!showDescription)
            .then(() => {
                updateShowDescription(!showDescription)
                toggleMoreOptions()
            })
            .catch(() => {
                const msg = showDescription
                    ? i18n.t('Failed to hide description')
                    : i18n.t('Failed to show description')
                warningAlert.show({ msg })
            })

    const toggleStarredDashboardLabel = starred
        ? i18n.t('Unstar dashboard')
        : i18n.t('Star dashboard')

    const onToggleStarredDashboard = () =>
        apiStarDashboard(dataEngine, id, !starred)
            .then(() => {
                setDashboardStarred(id, !starred)
                if (moreOptionsIsOpen) {
                    toggleMoreOptions()
                }
            })
            .catch(() => {
                const msg = starred
                    ? i18n.t('Failed to unstar the dashboard')
                    : i18n.t('Failed to star the dashboard')
                warningAlert.show({ msg })
            })

    const userAccess = orObject(access)

    const descriptionClasses = cx(
        classes.descContainer,
        description ? classes.desc : classes.noDesc
    )

    const getMoreMenu = () => (
        <FlyoutMenu>
            <MenuItem
                dense
                label={toggleStarredDashboardLabel}
                onClick={onToggleStarredDashboard}
            />
            <MenuItem
                dense
                label={showHideDescriptionLabel}
                onClick={onToggleShowDescription}
            />
            <MenuItem dense label={i18n.t('Print')} dataTest="print-menu-item">
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
    )

    const getMoreButton = (className, useSmall) => (
        <DropdownButton
            className={className}
            small={useSmall}
            onClick={toggleMoreOptions}
            icon={<IconMore24 color={colors.grey700} />}
            component={getMoreMenu()}
        >
            {i18n.t('More')}
        </DropdownButton>
    )

    return (
        <>
            <div className={classes.container}>
                <div className={classes.titleBar}>
                    <span
                        className={classes.title}
                        data-test="view-dashboard-title"
                    >
                        {name}
                    </span>
                    <div className={classes.actions}>
                        <div
                            className={classes.star}
                            onClick={onToggleStarredDashboard}
                            data-test="button-star-dashboard"
                        >
                            <Tooltip
                                content={
                                    starred
                                        ? i18n.t('Unstar dashboard')
                                        : i18n.t('Star dashboard')
                                }
                            >
                                <StarIcon
                                    color={colors.grey600}
                                    data-test={
                                        starred
                                            ? 'dashboard-starred'
                                            : 'dashboard-unstarred'
                                    }
                                />
                            </Tooltip>
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
                            <FilterSelector
                                allowedFilters={allowedFilters}
                                restrictFilters={restrictFilters}
                            />
                            {getMoreButton(classes.moreButton, false)}
                            {getMoreButton(classes.moreButtonSmall, true)}
                        </div>
                    </div>
                </div>
                {showDescription && (
                    <div
                        className={descriptionClasses}
                        data-test="dashboard-description"
                    >
                        {description || i18n.t('No description')}
                    </div>
                )}
            </div>
            {id && (
                <SharingDialog
                    d2={d2}
                    id={id}
                    type="dashboard"
                    open={sharingDialogIsOpen}
                    onRequestClose={toggleSharingDialog}
                />
            )}
        </>
    )
}

ViewTitleBar.propTypes = {
    access: PropTypes.object,
    allowedFilters: PropTypes.array,
    description: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    restrictFilters: PropTypes.bool,
    setDashboardStarred: PropTypes.func,
    showDescription: PropTypes.bool,
    starred: PropTypes.bool,
    updateShowDescription: PropTypes.func,
}

ViewTitleBar.defaultProps = {
    name: '',
    description: '',
    starred: false,
    showDescription: false,
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
        restrictFilters: dashboard.restrictFilters,
        allowedFilters: dashboard.allowedFilters,
    }
}

export default connect(mapStateToProps, {
    setDashboardStarred: acSetDashboardStarred,
    updateShowDescription: acSetSelectedShowDescription,
})(ViewTitleBar)
