// eslint-disable-next-line import/no-unresolved
import { Plugin } from '@dhis2/app-runtime/experimental'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useMemo, useReducer, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    EDIT,
    isEditMode,
    isViewMode,
} from '../../../modules/dashboardModes.js'
import { APP } from '../../../modules/itemTypes.js'
import { useCacheableSection } from '../../../modules/useCacheableSection.js'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../reducers/itemFilters.js'
import { sGetSelectedId } from '../../../reducers/selected.js'
import FatalErrorBoundary from '../FatalErrorBoundary.js'
import { isFullscreenSupported, onToggleFullscreen } from '../fullscreenUtil.js'
import { getAvailableDimensions } from '../getAvailableDimensions.js'
import ItemHeader from '../ItemHeader/ItemHeader.js'
import MissingPluginMessage from '../ItemMessage/MissingPluginMessage.js'
import { getIframeSrc } from './getIframeSrc.js'
import { ItemContextMenu } from './ItemContextMenu.js'

const AppItem = ({ dashboardMode, windowDimensions, item, apps }) => {
    const contentRef = useRef()
    const headerRef = useRef()
    const dashboardId = useSelector(sGetSelectedId)
    let itemFilters = useSelector(sGetItemFiltersRoot)

    if (isEditMode(dashboardMode)) {
        itemFilters = DEFAULT_STATE_ITEM_FILTERS
    }

    const { isCached } = useCacheableSection(dashboardId)

    const [loadItemFailed, setLoadItemFailed] = useState(false)

    const appDetails =
        item?.appKey && apps.find((app) => app.key === item.appKey)

    const [{ itemTitle, appUrl, onRemove }, setItemDetails] = useReducer(
        (state, newState) => ({
            ...state,
            ...newState,
            appUrl: `${appDetails?.launchUrl}${newState.appUrl}`,
        }),
        {
            itemTitle: appDetails?.name,
            appUrl: appDetails?.launchUrl,
        }
    )

    const pluginProps = useMemo(
        () => ({
            dashboardItemId: item.id,
            dashboardItemFilters: itemFilters,
            dashboardMode,
            // Edit mode does not have the hamburger menu.
            // Don't assume the plugin checks for this function before calling it
            setDashboardItemDetails: setItemDetails,
            cacheId: `${dashboardId}-${item.id}`,
            isParentCached: isCached,
        }),
        [dashboardId, dashboardMode, item.id, isCached, itemFilters]
    )

    // See DHIS2-9605
    const hideTitle =
        appDetails?.settings?.dashboardWidget?.hideTitle &&
        dashboardMode !== EDIT

    const renderPlugin = (iframeSrc) => {
        // style must be computed at runtime.
        // header/content elements need to be rendered first, otherwise the dimensions returned are the previous ones
        const style =
            headerRef.current && contentRef.current
                ? getAvailableDimensions({
                      item,
                      headerRef,
                      contentRef,
                      dashboardMode,
                      windowDimensions,
                  })
                : {}

        // we need width and height in order for resizing to work properly with the platform's plugin components
        if (!(style.width && style.height)) {
            return null
        }

        return appDetails?.appType === APP ? (
            // modern plugins
            <Plugin
                pluginSource={iframeSrc}
                width={style.width}
                height={style.height}
                {...pluginProps}
            />
        ) : (
            // legacy widgets
            <iframe
                title={appDetails.name}
                src={iframeSrc}
                className={
                    !hideTitle
                        ? 'dashboard-item-content'
                        : 'dashboard-item-content-hidden-title'
                }
                style={{
                    border: 'none',
                    width: style.width,
                    height: style.height,
                }}
            />
        )
    }

    const onFatalError = () => {
        setLoadItemFailed(true)
    }

    if (appDetails) {
        const iframeSrc = getIframeSrc(appDetails, item, itemFilters)

        const actionButtons =
            appDetails.pluginLaunchUrl && isViewMode(dashboardMode) ? (
                <ItemContextMenu
                    item={item}
                    appName={appDetails.name}
                    appUrl={appUrl}
                    onToggleFullscreen={() => onToggleFullscreen(item.id)}
                    fullscreenSupported={isFullscreenSupported(item.id)}
                    loadItemFailed={loadItemFailed}
                />
            ) : null

        return (
            <>
                <ItemHeader
                    ref={headerRef}
                    title={hideTitle ? '' : itemTitle}
                    actionButtons={actionButtons}
                    itemId={item.id}
                    dashboardMode={dashboardMode}
                    isShortened={item.shortened}
                    onDelete={onRemove}
                />
                <FatalErrorBoundary
                    message={i18n.t(
                        'There was a problem loading this dashboard item'
                    )}
                    onFatalError={onFatalError}
                >
                    <div className="dashboard-item-content" ref={contentRef}>
                        {renderPlugin(iframeSrc)}
                    </div>
                </FatalErrorBoundary>
            </>
        )
    } else {
        return (
            <MissingPluginMessage
                pluginName={item.appKey}
                dashboardMode={dashboardMode}
            />
        )
    }
}

AppItem.propTypes = {
    apps: PropTypes.array,
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    windowDimensions: PropTypes.object,
}

export default AppItem
