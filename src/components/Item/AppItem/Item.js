// eslint-disable-next-line import/no-unresolved
import { Plugin } from '@dhis2/app-runtime/experimental'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo, useReducer, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    EDIT,
    isEditMode,
    isViewMode,
} from '../../../modules/dashboardModes.js'
import { useCacheableSection } from '../../../modules/useCacheableSection.js'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../reducers/itemFilters.js'
import { sGetSelectedId } from '../../../reducers/selected.js'
import FatalErrorBoundary from '../FatalErrorBoundary.js'
import { isFullscreenSupported } from '../fullscreenUtil.js'
import { getAvailableDimensions } from '../getAvailableDimensions.js'
import ItemHeader from '../ItemHeader/ItemHeader.js'
import MissingPluginMessage from '../ItemMessage/MissingPluginMessage.js'
import { getIframeSrc } from './getIframeSrc.js'
import { ItemContextMenu } from './ItemContextMenu.js'
import styles from './styles/AppItem.module.css'

const AppItem = ({ dashboardMode, windowDimensions, item, apps, sortIndex, isFullscreen }) => {
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

    const [{ itemTitle, appUrl }, setItemDetails] = useReducer(
        (state, newState) => ({
            ...state,
            ...newState,
            appUrl: `${appDetails?.launchUrl}${newState.appUrl}`, // hack, should the plugin send an absolute URL?!
        }),
        { itemTitle: appDetails?.name, appUrl: appDetails?.launchUrl }
    )

    const pluginProps = useMemo(
        () => ({
            dashboardItemId: item.id,
            dashboardItemFilters: itemFilters,
            setDashboardItemDetails: setItemDetails,
            cacheId: `${dashboardId}-${item.id}`,
            isParentCached: isCached,
        }),
        [dashboardId, item.id, isCached, itemFilters]
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
                      isFullscreen,
                  })
                : {}

        return appDetails?.appType === 'APP' ? (
            // modern plugins
            <Plugin
                pluginSource={iframeSrc}
                hasFixedDimensions={true}
                width={style.width}
                height={style.height}
                {...pluginProps}
            />
        ) : (
            // legacy widgets
            <iframe
                title={appDetails.name}
                src={iframeSrc}
                className={cx(styles.content, {
                            [styles.hiddenTitle]: hideTitle,
                            [styles.fullscreen]: isFullscreen,
                        })}
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
                    enterFullscreen={() => setSlideshow(sortIndex)}
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
    isFullscreen: PropTypes.bool,
    item: PropTypes.object,
    sortIndex: PropTypes.number,
    windowDimensions: PropTypes.object,
}

export default AppItem
