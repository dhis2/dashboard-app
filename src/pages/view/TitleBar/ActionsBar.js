import {
    useDataEngine,
    useAlert,
    useOnlineStatus,
    useCacheableSection,
} from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import { FlyoutMenu, MenuItem, colors, IconMore24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { acSetDashboardStarred } from '../../../actions/dashboards'
import { acClearItemFilters } from '../../../actions/itemFilters'
import { acSetShowDescription } from '../../../actions/showDescription'
import { apiPostShowDescription } from '../../../api/description'
import Button from '../../../components/ButtonWithTooltip'
import ConfirmActionDialog from '../../../components/ConfirmActionDialog'
import DropdownButton from '../../../components/DropdownButton/DropdownButton'
import { orObject } from '../../../modules/util'
import { sGetDashboardStarred } from '../../../reducers/dashboards'
import { sGetNamedItemFilters } from '../../../reducers/itemFilters'
import { sGetSelected } from '../../../reducers/selected'
import { sGetShowDescription } from '../../../reducers/showDescription'
import { apiStarDashboard } from './apiStarDashboard'
import FilterSelector from './FilterSelector'
import StarDashboardButton from './StarDashboardButton'
import classes from './styles/ActionsBar.module.css'

const ViewActions = ({
    id,
    access,
    showDescription,
    starred,
    setDashboardStarred,
    updateShowDescription,
    removeAllFilters,
    restrictFilters,
    allowedFilters,
    filtersLength,
}) => {
    const [moreOptionsSmallIsOpen, setMoreOptionsSmallIsOpen] = useState(false)
    const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false)
    const [sharingDialogIsOpen, setSharingDialogIsOpen] = useState(false)
    const [confirmCacheDialogIsOpen, setConfirmCacheDialogIsOpen] =
        useState(false)
    const [redirectUrl, setRedirectUrl] = useState(null)
    const { d2 } = useD2()
    const dataEngine = useDataEngine()
    const { offline } = useOnlineStatus()
    const { lastUpdated, isCached, startRecording, remove } =
        useCacheableSection(id)

    const warningAlert = useAlert(({ msg }) => msg, {
        warning: true,
    })

    const toggleMoreOptions = small =>
        small
            ? setMoreOptionsSmallIsOpen(!moreOptionsSmallIsOpen)
            : setMoreOptionsIsOpen(!moreOptionsIsOpen)

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    const onCacheDashboardConfirmed = () => {
        setConfirmCacheDialogIsOpen(false)
        removeAllFilters()
        startRecording({})
    }

    const onToggleOfflineStatus = () => {
        toggleMoreOptions()

        if (lastUpdated) {
            return remove()
        }

        return filtersLength
            ? setConfirmCacheDialogIsOpen(true)
            : startRecording({})
    }

    const onUpdateOfflineCache = () => {
        toggleMoreOptions()
        return filtersLength
            ? setConfirmCacheDialogIsOpen(true)
            : startRecording({})
    }

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

    const onToggleSharingDialog = () =>
        setSharingDialogIsOpen(!sharingDialogIsOpen)

    const userAccess = orObject(access)

    const getMoreMenu = () => (
        <FlyoutMenu>
            <MenuItem
                dense
                disabled={offline}
                label={
                    lastUpdated
                        ? i18n.t('Remove from offline storage')
                        : i18n.t('Make available offline')
                }
                onClick={onToggleOfflineStatus}
            />
            {lastUpdated && (
                <MenuItem
                    dense
                    label={i18n.t('Sync offline data now')}
                    disabled={offline}
                    onClick={onUpdateOfflineCache}
                />
            )}
            <MenuItem
                dense
                disabled={offline}
                label={
                    starred
                        ? i18n.t('Unstar dashboard')
                        : i18n.t('Star dashboard')
                }
                onClick={onToggleStarredDashboard}
            />
            <MenuItem
                dense
                disabled={offline}
                label={
                    showDescription
                        ? i18n.t('Hide description')
                        : i18n.t('Show description')
                }
                onClick={onToggleShowDescription}
            />
            <MenuItem
                dense
                disabled={offline && !isCached}
                label={i18n.t('Print')}
                dataTest="print-menu-item"
            >
                <MenuItem
                    dense
                    label={i18n.t('Dashboard layout')}
                    onClick={() => setRedirectUrl(`${id}/printlayout`)}
                    dataTest="print-layout-menu-item"
                />
                <MenuItem
                    dense
                    label={i18n.t('One item per page')}
                    onClick={() => setRedirectUrl(`${id}/printoipp`)}
                    dataTest="print-oipp-menu-item"
                />
            </MenuItem>
        </FlyoutMenu>
    )

    const getMoreButton = (className, useSmall) => (
        <DropdownButton
            disabledWhenOffline={false}
            className={className}
            small={useSmall}
            onClick={() => toggleMoreOptions(useSmall)}
            icon={<IconMore24 color={colors.grey700} />}
            component={getMoreMenu()}
            open={useSmall ? moreOptionsSmallIsOpen : moreOptionsIsOpen}
        >
            {i18n.t('More')}
        </DropdownButton>
    )

    return (
        <>
            <div className={classes.actions}>
                <StarDashboardButton
                    starred={starred}
                    onClick={onToggleStarredDashboard}
                />
                <div className={classes.strip}>
                    {userAccess.update ? (
                        <Button
                            className={classes.editButton}
                            onClick={() => setRedirectUrl(`${id}/edit`)}
                        >
                            {i18n.t('Edit')}
                        </Button>
                    ) : null}
                    {userAccess.manage ? (
                        <Button
                            className={classes.shareButton}
                            onClick={onToggleSharingDialog}
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
            {id && (
                <SharingDialog
                    d2={d2}
                    id={id}
                    type="dashboard"
                    onRequestClose={onToggleSharingDialog}
                    open={sharingDialogIsOpen}
                    insertTheme={true}
                    isOffline={offline}
                    offlineMessage={i18n.t('Not available offline')}
                />
            )}
            <ConfirmActionDialog
                title={i18n.t('Clear dashboard filters?')}
                message={i18n.t(
                    "A dashboard's filters can’t be saved offline. Do you want to remove the filters and make this dashboard available offline?"
                )}
                cancelLabel={i18n.t('No, cancel')}
                confirmLabel={i18n.t('Yes, clear filters and sync')}
                onConfirm={onCacheDashboardConfirmed}
                onCancel={() => setConfirmCacheDialogIsOpen(false)}
                open={confirmCacheDialogIsOpen}
            />
        </>
    )
}

ViewActions.propTypes = {
    access: PropTypes.object,
    allowedFilters: PropTypes.array,
    filtersLength: PropTypes.number,
    id: PropTypes.string,
    removeAllFilters: PropTypes.func,
    restrictFilters: PropTypes.bool,
    setDashboardStarred: PropTypes.func,
    showDescription: PropTypes.bool,
    starred: PropTypes.bool,
    updateShowDescription: PropTypes.func,
}

const mapStateToProps = state => {
    const dashboard = sGetSelected(state)

    return {
        ...dashboard,
        filtersLength: sGetNamedItemFilters(state).length,
        starred: dashboard.id
            ? sGetDashboardStarred(state, dashboard.id)
            : false,
        showDescription: sGetShowDescription(state),
    }
}

export default connect(mapStateToProps, {
    setDashboardStarred: acSetDashboardStarred,
    removeAllFilters: acClearItemFilters,
    updateShowDescription: acSetShowDescription,
})(ViewActions)
