import { OfflineTooltip } from '@dhis2/analytics'
import { useDataEngine, useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    FlyoutMenu,
    colors,
    IconMore16,
    SharingDialog,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory, Redirect } from 'react-router-dom'
import { acClearItemFilters } from '../../../actions/itemFilters.js'
import { acSetShowDescription } from '../../../actions/showDescription.js'
import { acSetSlideshow } from '../../../actions/slideshow.js'
import { apiPostShowDescription } from '../../../api/description.js'
import ConfirmActionDialog from '../../../components/ConfirmActionDialog.js'
import DropdownButton from '../../../components/DropdownButton/DropdownButton.js'
import MenuItem from '../../../components/MenuItemWithTooltip.js'
import { useSystemSettings } from '../../../components/SystemSettingsProvider.js'
import { itemTypeSupportsFullscreen } from '../../../modules/itemTypes.js'
import { useCacheableSection } from '../../../modules/useCacheableSection.js'
import { orObject } from '../../../modules/util.js'
import { ROUTE_START_PATH } from '../../../pages/start/index.js'
import { msGetNamedItemFilters } from '../../../reducers/itemFilters.js'
import {
    sGetSelected,
    sGetSelectedIsEmbedded,
} from '../../../reducers/selected.js'
import { sGetShowDescription } from '../../../reducers/showDescription.js'
import { UpdateSupersetDashboardModal } from '../ConfigureSupersetDashboard/UpdateSupersetDashboardModal.js'
import FilterSelector from './FilterSelector.js'
import classes from './styles/ActionsBar.module.css'

const ActionsBar = ({
    id,
    access,
    showDescription,
    starred,
    setSlideshow,
    embedded,
    toggleDashboardStarred,
    showAlert,
    updateShowDescription,
    removeAllFilters,
    restrictFilters,
    allowedFilters,
    filtersLength,
    dashboardItems,
}) => {
    const history = useHistory()
    const dataEngine = useDataEngine()
    const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false)
    const [sharingDialogIsOpen, setSharingDialogIsOpen] = useState(false)
    const [confirmCacheDialogIsOpen, setConfirmCacheDialogIsOpen] =
        useState(false)
    const [
        updateEmbeddedDashboardModalIsOpen,
        setUpdateEmbeddedDashboardModalIsOpen,
    ] = useState(false)
    const [redirectUrl, setRedirectUrl] = useState(null)
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const { lastUpdated, isCached, startRecording, remove } =
        useCacheableSection(id)
    const { allowVisFullscreen } = useSystemSettings().systemSettings
    const notAvailableForEmbeddedDashboardsMsg = i18n.t(
        'Not available for embedded dashboards'
    )
    const handleEditClick = useCallback(() => {
        if (embedded) {
            setUpdateEmbeddedDashboardModalIsOpen(true)
        } else {
            setRedirectUrl(`${id}/edit`)
        }
    }, [embedded, id, setRedirectUrl])

    const onRecordError = useCallback(() => {
        showAlert({
            msg: i18n.t(
                "The dashboard couldn't be made available offline. Try again."
            ),
            isCritical: true,
        })
    }, [showAlert])

    const onCacheDashboardConfirmed = useCallback(() => {
        setConfirmCacheDialogIsOpen(false)
        removeAllFilters()
        startRecording({
            onError: onRecordError,
        })
    }, [onRecordError, removeAllFilters, startRecording])

    const onRemoveFromOffline = useCallback(() => {
        setMoreOptionsIsOpen(false)
        lastUpdated && remove()
    }, [lastUpdated, remove])

    const onAddToOffline = useCallback(() => {
        setMoreOptionsIsOpen(false)
        return filtersLength
            ? setConfirmCacheDialogIsOpen(true)
            : startRecording({
                  onError: onRecordError,
              })
    }, [filtersLength, onRecordError, startRecording])

    const onToggleShowDescription = useCallback(() => {
        updateShowDescription(!showDescription)
        setMoreOptionsIsOpen(false)
        !offline && apiPostShowDescription(!showDescription, dataEngine)
    }, [offline, showDescription, updateShowDescription, dataEngine])

    const onToggleSharingDialog = useCallback(
        () => setSharingDialogIsOpen(!sharingDialogIsOpen),
        [sharingDialogIsOpen]
    )

    const userAccess = orObject(access)

    const hasSlideshowItems = dashboardItems?.some(
        (i) => itemTypeSupportsFullscreen(i.type) || false
    )

    const getMoreMenu = () => (
        <FlyoutMenu>
            {lastUpdated ? (
                <MenuItem
                    dense
                    disabledWhenOffline={false}
                    label={i18n.t('Remove from offline storage')}
                    onClick={onRemoveFromOffline}
                />
            ) : (
                <MenuItem
                    dense
                    disabled={offline || embedded}
                    label={i18n.t('Make available offline')}
                    onClick={onAddToOffline}
                    tooltip={
                        embedded
                            ? notAvailableForEmbeddedDashboardsMsg
                            : undefined
                    }
                />
            )}
            {lastUpdated && (
                <MenuItem
                    dense
                    label={i18n.t('Sync offline data now')}
                    disabled={offline}
                    onClick={onAddToOffline}
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
                onClick={() => {
                    toggleDashboardStarred()
                    setMoreOptionsIsOpen(false)
                }}
            />
            <MenuItem
                dense
                disabledWhenOffline={false}
                label={
                    showDescription
                        ? i18n.t('Hide description')
                        : i18n.t('Show description')
                }
                onClick={onToggleShowDescription}
            />
            <MenuItem
                dense
                disabled={(offline && !isCached) || embedded}
                disabledWhenOffline={false}
                label={i18n.t('Print')}
                dataTest="print-menu-item"
                tooltip={
                    embedded ? notAvailableForEmbeddedDashboardsMsg : undefined
                }
            >
                <MenuItem
                    dense
                    disabled={offline && !isCached}
                    disabledWhenOffline={false}
                    label={i18n.t('Dashboard layout')}
                    onClick={() => setRedirectUrl(`${id}/printlayout`)}
                    dataTest="print-layout-menu-item"
                />
                <MenuItem
                    dense
                    disabled={offline && !isCached}
                    disabledWhenOffline={false}
                    label={i18n.t('One item per page')}
                    onClick={() => setRedirectUrl(`${id}/printoipp`)}
                    dataTest="print-oipp-menu-item"
                />
            </MenuItem>
            <MenuItem
                dense
                disabledWhenOffline={false}
                label={i18n.t('Close dashboard')}
                onClick={() => history.push(ROUTE_START_PATH)}
            />
        </FlyoutMenu>
    )

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    const getSlideshowTooltipContent = () => {
        if (embedded) {
            return notAvailableForEmbeddedDashboardsMsg
        } else if (!hasSlideshowItems) {
            return i18n.t('No dashboard items to show in slideshow')
        } else if (offline && !isCached) {
            return i18n.t('Not available offline')
        } else {
            return null
        }
    }

    const slideshowTooltipContent = getSlideshowTooltipContent()

    return (
        <>
            <div className={classes.actions}>
                <div className={classes.hideOnSmallScreen}>
                    {userAccess.update ? (
                        <OfflineTooltip>
                            <Button
                                secondary
                                small
                                disabled={offline}
                                onClick={handleEditClick}
                            >
                                {i18n.t('Edit')}
                            </Button>
                        </OfflineTooltip>
                    ) : null}
                    {userAccess.manage ? (
                        <OfflineTooltip>
                            <Button
                                secondary
                                small
                                disabled={offline}
                                onClick={onToggleSharingDialog}
                            >
                                {i18n.t('Share')}
                            </Button>
                        </OfflineTooltip>
                    ) : null}
                    {allowVisFullscreen ? (
                        <OfflineTooltip
                            content={slideshowTooltipContent}
                            disabled={!!slideshowTooltipContent}
                            disabledWhenOffline={false}
                        >
                            <Button
                                secondary
                                small
                                disabled={!!slideshowTooltipContent}
                                className={classes.slideshowButton}
                                onClick={() => setSlideshow(0)}
                                dataTest="enter-slideshow-button"
                            >
                                {i18n.t('Slideshow')}
                            </Button>
                        </OfflineTooltip>
                    ) : null}
                    <FilterSelector
                        allowedFilters={allowedFilters}
                        restrictFilters={restrictFilters}
                    />
                </div>
                <DropdownButton
                    dataTest="more-actions-button"
                    className={classes.more}
                    secondary
                    small
                    open={moreOptionsIsOpen}
                    disabledWhenOffline={false}
                    onClick={() => setMoreOptionsIsOpen(!moreOptionsIsOpen)}
                    icon={<IconMore16 color={colors.grey700} />}
                    component={getMoreMenu()}
                >
                    <wbr />
                </DropdownButton>
            </div>
            {id && sharingDialogIsOpen && (
                <SharingDialog
                    cascadeDashboardSharing={!embedded}
                    id={id}
                    type="dashboard"
                    onClose={onToggleSharingDialog}
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
            {updateEmbeddedDashboardModalIsOpen && (
                <UpdateSupersetDashboardModal
                    closeModal={() =>
                        setUpdateEmbeddedDashboardModalIsOpen(false)
                    }
                />
            )}
        </>
    )
}

ActionsBar.propTypes = {
    access: PropTypes.object,
    allowedFilters: PropTypes.array,
    dashboardItems: PropTypes.array,
    embedded: PropTypes.bool,
    filtersLength: PropTypes.number,
    id: PropTypes.string,
    removeAllFilters: PropTypes.func,
    restrictFilters: PropTypes.bool,
    setSlideshow: PropTypes.func,
    showAlert: PropTypes.func,
    showDescription: PropTypes.bool,
    starred: PropTypes.bool,
    toggleDashboardStarred: PropTypes.func,
    updateShowDescription: PropTypes.func,
}

const mapStateToProps = (state) => {
    const dashboard = sGetSelected(state)

    return {
        ...dashboard,
        embedded: sGetSelectedIsEmbedded(state),
        filtersLength: msGetNamedItemFilters(state).length,
        showDescription: sGetShowDescription(state),
    }
}

export default connect(mapStateToProps, {
    setSlideshow: acSetSlideshow,
    removeAllFilters: acClearItemFilters,
    updateShowDescription: acSetShowDescription,
})(ActionsBar)
