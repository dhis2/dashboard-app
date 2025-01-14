import { OfflineTooltip } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
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
import { sGetNamedItemFilters } from '../../../reducers/itemFilters.js'
import { sGetSelected } from '../../../reducers/selected.js'
import { sGetShowDescription } from '../../../reducers/showDescription.js'
import FilterSelector from './FilterSelector.js'
import classes from './styles/ActionsBar.module.css'

const ActionsBar = ({
    id,
    access,
    showDescription,
    starred,
    setSlideshow,
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
    const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false)
    const [sharingDialogIsOpen, setSharingDialogIsOpen] = useState(false)
    const [confirmCacheDialogIsOpen, setConfirmCacheDialogIsOpen] =
        useState(false)
    const [redirectUrl, setRedirectUrl] = useState(null)
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const { lastUpdated, isCached, startRecording, remove } =
        useCacheableSection(id)
    const { allowVisFullscreen } = useSystemSettings().systemSettings

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
        !offline && apiPostShowDescription(!showDescription)
    }, [offline, showDescription, updateShowDescription])

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
                    disabled={offline}
                    label={i18n.t('Make available offline')}
                    onClick={onAddToOffline}
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
                onClick={toggleDashboardStarred}
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
                disabled={offline && !isCached}
                disabledWhenOffline={false}
                label={i18n.t('Print')}
                dataTest="print-menu-item"
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
        if (!hasSlideshowItems) {
            return i18n.t('No dashboard items to show in slideshow')
        } else if (offline && !isCached) {
            return i18n.t('Not available offline')
        }
        return null
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
                                onClick={() => setRedirectUrl(`${id}/edit`)}
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
        </>
    )
}

ActionsBar.propTypes = {
    access: PropTypes.object,
    allowedFilters: PropTypes.array,
    dashboardItems: PropTypes.array,
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
        filtersLength: sGetNamedItemFilters(state).length,
        showDescription: sGetShowDescription(state),
    }
}

export default connect(mapStateToProps, {
    setSlideshow: acSetSlideshow,
    removeAllFilters: acClearItemFilters,
    updateShowDescription: acSetShowDescription,
})(ActionsBar)
