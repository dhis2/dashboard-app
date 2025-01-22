// eslint-disable-next-line import/no-unresolved
import { Plugin } from '@dhis2/app-runtime/experimental'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, {
    useCallback,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetSlideshow } from '../../../actions/slideshow.js'
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
import { getAvailableDimensions } from '../getAvailableDimensions.js'
import ItemHeader from '../ItemHeader/ItemHeader.js'
import MissingPluginMessage from '../ItemMessage/MissingPluginMessage.js'
import { getIframeSrc } from './getIframeSrc.js'
import { ItemContextMenu } from './ItemContextMenu.js'
import styles from './styles/AppItem.module.css'

const AppItem = ({
    dashboardMode,
    windowDimensions,
    item,
    apps,
    sortIndex,
    isFullscreen,
}) => {
    const contentRef = useRef(null)
    const headerRef = useRef(null)
    const [isMounted, setIsMounted] = useState(false)
    const dashboardId = useSelector(sGetSelectedId)
    const isSlideshowView = useSelector((state) => state.slideshow !== null)
    let itemFilters = useSelector(sGetItemFiltersRoot)
    const dispatch = useDispatch()

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

    // https://docs.dhis2.org/en/develop/apps/application-manifest.html#apps_creating_apps
    // https://dhis2.atlassian.net/browse/DHIS2-9605
    const hideTitle =
        appDetails?.settings?.dashboardWidget?.hideTitle &&
        dashboardMode !== EDIT

    const onHeaderMount = useCallback((node) => {
        if (node === null || (headerRef.current && contentRef.current)) {
            return
        }

        headerRef.current = node
        contentRef.current && setIsMounted(true)
    }, [])

    const onContentMount = useCallback((node) => {
        if (node === null || (headerRef.current && contentRef.current)) {
            return
        }

        contentRef.current = node
        headerRef.current && setIsMounted(true)
    }, [])

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
        const iframeSrc = getIframeSrc(item, itemFilters, appDetails)

        const actionButtons =
            appDetails.pluginLaunchUrl &&
            isViewMode(dashboardMode) &&
            !isSlideshowView ? (
                <ItemContextMenu
                    item={item}
                    appName={appDetails.name}
                    appUrl={appUrl}
                    enterFullscreen={() => dispatch(acSetSlideshow(sortIndex))}
                    loadItemFailed={loadItemFailed}
                />
            ) : null

        return (
            <>
                <ItemHeader
                    ref={onHeaderMount}
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
                    <div
                        className={cx(styles.content, {
                            [styles.hiddenTitle]: hideTitle,
                            [styles.fullscreen]: isFullscreen,
                        })}
                        ref={onContentMount}
                    >
                        {isMounted && renderPlugin(iframeSrc)}
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
