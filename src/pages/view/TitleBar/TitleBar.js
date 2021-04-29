import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import i18n from '@dhis2/d2-i18n'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import { FlyoutMenu, MenuItem, colors, IconMore24 } from '@dhis2/ui'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'

import FilterSelector from './FilterSelector'
import LastUpdatedTag from './LastUpdatedTag'
import Description from './Description'
import Button from '../../../components/ButtonWithTooltip'
import StarDashboardButton from './StarDashboardButton'
import { apiStarDashboard } from './apiStarDashboard'
import { orObject } from '../../../modules/util'
import { useOnlineStatus } from '../../../modules/useOnlineStatus'
import { useCacheableSectionStatus } from '../../../modules/useCacheableSectionStatus'
import { apiPostShowDescription } from '../../../api/description'
import { acSetDashboardStarred } from '../../../actions/dashboards'
import { acSetShowDescription } from '../../../actions/showDescription'
import DropdownButton from '../../../components/DropdownButton/DropdownButton'
import { sGetSelected } from '../../../reducers/selected'
import { sGetShowDescription } from '../../../reducers/showDescription'

import classes from './styles/TitleBar.module.css'

const ViewTitleBar = ({
    id,
    displayName,
    displayDescription,
    access,
    showDescription,
    starred,
    setDashboardStarred,
    updateShowDescription,
    restrictFilters,
    allowedFilters,
}) => {
    const [moreOptionsSmallIsOpen, setMoreOptionsSmallIsOpen] = useState(false)
    const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false)
    const [sharingDialogIsOpen, setSharingDialogIsOpen] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState(null)
    const { d2 } = useD2()
    const dataEngine = useDataEngine()
    const { isOnline } = useOnlineStatus()
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

    const toggleMoreOptions = small =>
        small
            ? setMoreOptionsSmallIsOpen(!moreOptionsSmallIsOpen)
            : setMoreOptionsIsOpen(!moreOptionsIsOpen)

    const printLayout = () => setRedirectUrl(`${id}/printlayout`)
    const printOipp = () => setRedirectUrl(`${id}/printoipp`)
    const enterEditMode = () => setRedirectUrl(`${id}/edit`)

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

    const userAccess = orObject(access)

    const getMoreMenu = () => (
        <FlyoutMenu>
            <MenuItem
                dense
                disabled={!isOnline}
                label={toggleSaveOfflineLabel}
                onClick={onToggleOfflineStatus}
            />
            {lastUpdated && (
                <MenuItem
                    dense
                    label={i18n.t('Sync offline data now')}
                    disabled={!isOnline}
                    onClick={onUpdateOfflineCache}
                />
            )}
            <MenuItem
                dense
                disabled={!isOnline}
                label={toggleStarredDashboardLabel}
                onClick={onToggleStarredDashboard}
            />
            <MenuItem
                dense
                disabled={!isOnline}
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
            <div className={classes.container}>
                <div
                    className={classes.titleBar}
                    style={{ position: 'relative' }}
                >
                    <span
                        className={classes.title}
                        data-test="view-dashboard-title"
                    >
                        {displayName}
                    </span>
                    <div className={classes.actions}>
                        <StarDashboardButton
                            starred={starred}
                            isOnline={isOnline}
                            onClick={onToggleStarredDashboard}
                        />
                        <div className={classes.strip}>
                            {userAccess.update ? (
                                <Button onClick={enterEditMode}>
                                    {i18n.t('Edit')}
                                </Button>
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
                <Description
                    showDescription={showDescription}
                    description={displayDescription}
                />
                <LastUpdatedTag lastUpdated={lastUpdated} />
            </div>
            {id && (
                <SharingDialog
                    d2={d2}
                    id={id}
                    type="dashboard"
                    open={sharingDialogIsOpen}
                    onRequestClose={toggleSharingDialog}
                    insertTheme={true}
                />
            )}
        </>
    )
}

ViewTitleBar.propTypes = {
    access: PropTypes.object,
    allowedFilters: PropTypes.array,
    displayDescription: PropTypes.string,
    displayName: PropTypes.string,
    id: PropTypes.string,
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
        showDescription: sGetShowDescription(state),
    }
}

export default connect(mapStateToProps, {
    setDashboardStarred: acSetDashboardStarred,
    updateShowDescription: acSetShowDescription,
})(ViewTitleBar)
