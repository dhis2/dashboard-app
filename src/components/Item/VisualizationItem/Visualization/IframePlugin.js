import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import postRobot from '@krakenjs/post-robot'
import PropTypes from 'prop-types'
import React, { useRef, useCallback, useState, useEffect } from 'react'
import { itemTypeMap } from '../../../../modules/itemTypes.js'
import { getPluginOverrides } from '../../../../modules/localStorage.js'
import { useCacheableSection } from '../../../../modules/useCacheableSection.js'
import { useUserSettings } from '../../../UserSettingsProvider.js'
import classes from './styles/DataVisualizerPlugin.module.css'
import VisualizationErrorMessage from './VisualizationErrorMessage.js'

const IframePlugin = ({
    filterVersion,
    item,
    style,
    visualization,
    dashboardMode,
    dashboardId,
}) => {
    const { d2 } = useD2()
    // TODO replace d2 with useCachedDataQuery
    const apps = d2.system.installedApps
    const { userSettings } = useUserSettings()
    const iframeRef = useRef()
    const [error, setError] = useState(false)

    // When this mounts, check if the dashboard is recording
    const { isCached, recordingState } = useCacheableSection(dashboardId)
    const [recordOnNextLoad, setRecordOnNextLoad] = useState(
        recordingState === 'recording'
    )

    const onError = () => setError(true)

    useEffect(() => {
        // Tell plugin to remove cached data if this dashboard has been removed
        // from offline storage
        if (iframeRef?.current && !isCached) {
            postRobot
                .send(iframeRef.current.contentWindow, 'removeCachedData')
                .catch((err) => {
                    // catch error if iframe hasn't loaded yet
                    const msg = 'No handler found for post message:'
                    if (err.message.startsWith(msg)) {
                        return
                    }
                    console.error(err)
                })
        }
    }, [isCached])

    useEffect(() => {
        if (iframeRef?.current) {
            const listener = postRobot.on(
                'getProps',
                // listen for messages coming only from the iframe rendered by this component
                { window: iframeRef.current.contentWindow },
                () => {
                    const pluginProps = {
                        isVisualizationLoaded: true,
                        forDashboard: true,
                        displayProperty: userSettings.displayProperty,
                        visualization,
                        onError,

                        // For caching: ---
                        // Add user & dashboard IDs to cache ID to avoid removing a cached
                        // plugin that might be used in another dashboard also
                        // TODO: May also want user ID too for multi-user situations
                        cacheId: `${dashboardId}-${item.id}`,
                        isParentCached: isCached,
                        recordOnNextLoad: recordOnNextLoad,
                    }

                    if (recordOnNextLoad) {
                        // Avoid recording unnecessarily,
                        // e.g. if plugin re-requests props for some reason
                        setRecordOnNextLoad(false)
                    }

                    return pluginProps
                }
            )

            return () => listener.cancel()
        }
    }, [
        visualization,
        userSettings,
        dashboardId,
        item.id,
        isCached,
        recordOnNextLoad,
    ])

    useEffect(() => {
        setError(false)
    }, [filterVersion, visualization.type])

    const getIframeSrc = useCallback(() => {
        // 1. check if there is an override for the plugin
        const pluginOverrides = getPluginOverrides()

        if (pluginOverrides && pluginOverrides[item.type]) {
            return pluginOverrides[item.type]
        }

        const appKey = itemTypeMap[item.type].appKey

        // 2. check if there is an installed app for the item type
        // and use its plugin launch URL
        if (appKey) {
            const appDetails = apps.find((app) => app.key === appKey)

            if (appDetails?.pluginLaunchUrl) {
                return appDetails.pluginLaunchUrl
            }
        }

        setError(true)

        return
    }, [item.type, apps])

    if (error) {
        return (
            <div style={style}>
                <VisualizationErrorMessage
                    item={item}
                    dashboardMode={dashboardMode}
                />
            </div>
        )
    }

    const iframeSrc = getIframeSrc()

    return (
        <div className={classes.wrapper}>
            {iframeSrc ? (
                <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    // preserve dimensions if provided
                    style={{
                        width: style.width || '100%',
                        height: style.height || '100%',
                        border: 'none',
                    }}
                ></iframe>
            ) : null}
        </div>
    )
}

IframePlugin.propTypes = {
    dashboardId: PropTypes.string,
    dashboardMode: PropTypes.string,
    filterVersion: PropTypes.string,
    item: PropTypes.object,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

export default IframePlugin
