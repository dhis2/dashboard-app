import {
    useCacheableSection,
    useDhis2ConnectionStatus,
} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { FlyoutMenu, MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { acClearItemFilters } from '../../../actions/itemFilters.js'
import { acSetShowDescription } from '../../../actions/showDescription.js'
import { apiPostShowDescription } from '../../../api/description.js'
import { ROUTE_START_PATH } from '../../../pages/start/index.js'
import { sGetNamedItemFilters } from '../../../reducers/itemFilters.js'
import { sGetSelected } from '../../../reducers/selected.js'
import { sGetShowDescription } from '../../../reducers/showDescription.js'
import ConfirmActionDialog from '../../ConfirmActionDialog.js'

const MoreMenu = ({
    close,
    filtersLength,
    id,
    removeAllFilters,
    showAlert,
    showDescription,
    starred,
    toggleDashboardStarred,
    updateShowDescription,
}) => {
    const history = useHistory()
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const { lastUpdated, isCached, startRecording, remove } =
        useCacheableSection(id)
    const [confirmCacheDialogIsOpen, setConfirmCacheDialogIsOpen] =
        useState(false)

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
        close()
        lastUpdated && remove()
    }, [lastUpdated, remove, close])

    const onAddToOffline = useCallback(() => {
        close()
        return filtersLength
            ? setConfirmCacheDialogIsOpen(true)
            : startRecording({
                  onError: onRecordError,
              })
    }, [filtersLength, onRecordError, startRecording, close])

    const onToggleShowDescription = useCallback(() => {
        updateShowDescription(!showDescription)
        close()
        !offline && apiPostShowDescription(!showDescription)
    }, [offline, showDescription, updateShowDescription, close])

    return (
        <>
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
                        onClick={() => history.push(`${id}/printlayout`)}
                        dataTest="print-layout-menu-item"
                    />
                    <MenuItem
                        dense
                        disabled={offline && !isCached}
                        disabledWhenOffline={false}
                        label={i18n.t('One item per page')}
                        onClick={() => history.push(`${id}/printoipp`)}
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

MoreMenu.propTypes = {
    close: PropTypes.func,
    filtersLength: PropTypes.number,
    id: PropTypes.string,
    removeAllFilters: PropTypes.func,
    showAlert: PropTypes.func,
    showDescription: PropTypes.bool,
    starred: PropTypes.bool,
    toggleDashboardStarred: PropTypes.func,
    updateShowDescription: PropTypes.func,
}

const mapStateToProps = (state) => {
    const dashboard = sGetSelected(state)

    return {
        filtersLength: sGetNamedItemFilters(state).length,
        id: dashboard.id,
        showDescription: sGetShowDescription(state),
        starred: dashboard.starred,
    }
}

export default connect(mapStateToProps, {
    removeAllFilters: acClearItemFilters,
    updateShowDescription: acSetShowDescription,
})(MoreMenu)
