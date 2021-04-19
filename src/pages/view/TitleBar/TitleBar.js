import React, { useState, createRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Link, Redirect } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import {
    Button,
    FlyoutMenu,
    Layer,
    Popper,
    MenuItem,
    Tag,
    colors,
} from '@dhis2/ui'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'

import FilterSelector from './FilterSelector'
import { apiStarDashboard } from './starDashboard'
import { useOnlineStatus } from '../../../modules/useOnlineStatus'
import { useCacheableSectionStatus } from '../../../modules/useCacheableSectionStatus'
import { orObject } from '../../../modules/util'
import { ThreeDots } from '../../../components/Item/VisualizationItem/assets/icons'
import { apiPostShowDescription } from '../../../api/description'

import { acSetDashboardStarred } from '../../../actions/dashboards'
import { acSetSelectedShowDescription } from '../../../actions/selected'
import {
    sGetSelectedId,
    sGetSelectedShowDescription,
} from '../../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
    EMPTY_DASHBOARD,
} from '../../../reducers/dashboards'

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
    const { isOnline, toggleIsOnline } = useOnlineStatus()
    const {
        lastUpdated,
        updateCache,
        removeFromCache,
    } = useCacheableSectionStatus(id)

    const warningAlert = useAlert(({ msg }) => msg, {
        warning: true,
    })

    const toggleSharingDialog = () =>
        setSharingDialogIsOpen(!sharingDialogIsOpen)

    const toggleMoreOptions = () => setMoreOptionsIsOpen(!moreOptionsIsOpen)

    const printLayout = () => setRedirectUrl(`${id}/printlayout`)
    const printOipp = () => setRedirectUrl(`${id}/printoipp`)

    const StarIcon = starred ? Star : StarBorder

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    const toggleSaveOfflineLabel = lastUpdated
        ? i18n.t('Remove from offline storage')
        : i18n.t('Make available offline')

    const onToggleOfflineStatus = () => {
        lastUpdated ? removeFromCache() : updateCache()
        toggleMoreOptions()
    }

    const onUpdateOfflineCache = () => {
        updateCache()
        toggleMoreOptions()
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

    const buttonRef = createRef()

    const userAccess = orObject(access)

    const descriptionClasses = cx(
        classes.descContainer,
        description ? classes.desc : classes.noDesc
    )

    const getMoreButton = (className, useSmall) => (
        <Button
            className={className}
            small={useSmall}
            onClick={toggleMoreOptions}
        >
            <ThreeDots />
            <span className={classes.moreText}>{i18n.t('More')}</span>
        </Button>
    )

    return (
        <>
            <div className={classes.container}>
                <div
                    className={classes.titleBar}
                    style={{ position: 'relative' }}
                >
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
                            <StarIcon
                                style={{ fill: colors.grey600 }}
                                data-test={
                                    starred
                                        ? 'dashboard-starred'
                                        : 'dashboard-unstarred'
                                }
                            />
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
                            <span ref={buttonRef}>
                                {getMoreButton(classes.moreButton, false)}
                                {getMoreButton(classes.moreButtonSmall, true)}
                            </span>
                        </div>
                        {moreOptionsIsOpen && (
                            <Layer
                                position="fixed"
                                level={2000}
                                onClick={toggleMoreOptions}
                            >
                                <Popper
                                    reference={buttonRef}
                                    placement="bottom-start"
                                >
                                    <FlyoutMenu>
                                        <MenuItem
                                            dense
                                            label={toggleSaveOfflineLabel}
                                            onClick={onToggleOfflineStatus}
                                        />
                                        {lastUpdated && (
                                            <MenuItem
                                                dense
                                                label={i18n.t(
                                                    'Sync offline data now'
                                                )}
                                                disabled={!isOnline}
                                                onClick={onUpdateOfflineCache}
                                            />
                                        )}
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
                                        <MenuItem
                                            dense
                                            label={i18n.t('Print')}
                                            dataTest="print-menu-item"
                                        >
                                            <MenuItem
                                                dense
                                                label={i18n.t(
                                                    'Dashboard layout'
                                                )}
                                                onClick={printLayout}
                                                dataTest="print-layout-menu-item"
                                            />
                                            <MenuItem
                                                dense
                                                label={i18n.t(
                                                    'One item per page'
                                                )}
                                                onClick={printOipp}
                                                dataTest="print-oipp-menu-item"
                                            />
                                        </MenuItem>
                                    </FlyoutMenu>
                                </Popper>
                            </Layer>
                        )}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                        }}
                    >
                        <Tag>{`isOnline: ${isOnline}`}</Tag>
                        <Button onClick={toggleIsOnline}>
                            Toggle online status
                        </Button>
                    </div>
                </div>
                <Tag>{`Last updated: ${lastUpdated}`}</Tag>
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
