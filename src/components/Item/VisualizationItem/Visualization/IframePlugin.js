import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import PropTypes from 'prop-types'
import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react'
import {
    CHART,
    REPORT_TABLE,
    VISUALIZATION,
} from '../../../../modules/itemTypes.js'
import { getPluginOverrides } from '../../../../modules/localStorage.js'
import { useCacheableSection } from '../../../../modules/useCacheableSection.js'
import { useUserSettings } from '../../../UserSettingsProvider.js'
import MissingPluginMessage from './MissingPluginMessage.js'
import { getPluginLaunchUrl } from './plugin.js'
import classes from './styles/DataVisualizerPlugin.module.css'
import VisualizationErrorMessage from './VisualizationErrorMessage.js'

const IframePlugin = ({
    activeType,
    filterVersion,
    item,
    style,
    visualization,
    dashboardMode,
    dashboardId,
}) => {
    const { d2 } = useD2()

    const { userSettings } = useUserSettings()
    const iframeRef = useRef()
    const [error, setError] = useState(null)
    const channelRef = useRef(new MessageChannel())

    // When this mounts, check if the dashboard is recording
    const { isCached, recordingState } = useCacheableSection(dashboardId)
    const [recordOnNextLoad, setRecordOnNextLoad] = useState(
        recordingState === 'recording'
    )

    const pluginProps = useMemo(
        () => ({
            isVisualizationLoaded: true,
            forDashboard: true,
            displayProperty: userSettings.displayProperty,
            visualization,
            onError: () => setError('plugin'),

            // For caching: ---
            // Add user & dashboard IDs to cache ID to avoid removing a cached
            // plugin that might be used in another dashboard also
            // TODO: May also want user ID too for multi-user situations
            cacheId: `${dashboardId}-${item.id}`,
            isParentCached: isCached,
            recordOnNextLoad: recordOnNextLoad,
        }),
        [
            userSettings.displayProperty,
            visualization,
            dashboardId,
            isCached,
            item.id,
            recordOnNextLoad,
        ]
    )

    useEffect(() => {
        const onMessage = (e) => {
            console.log('message received in app', e)

            // cannot test e.origin
            if (e.data === 'requestPort') {
                channelRef.current = new MessageChannel()
                channelRef.current.port1.onmessage = (e) => {
                    console.log('message received in app via channel', e)
                    let data

                    try {
                        data = JSON.parse(e.data)
                    } catch (err) {
                        console.log(
                            'Event data is not a serialised JSON object'
                        )
                    }

                    // TODO not really required here since it's only messages in the private channel
                    if (data.type === 'DHIS2') {
                        switch (data.command) {
                            case 'requestProps': {
                                if (recordOnNextLoad) {
                                    // Avoid recording unnecessarily,
                                    // e.g. if plugin re-requests props for some reason
                                    setRecordOnNextLoad(false)
                                }
                                console.log('send props')
                                channelRef.current.port1.postMessage(
                                    JSON.stringify({
                                        type: 'DHIS2',
                                        command: 'sendProps',
                                        payload: pluginProps,
                                    })
                                )
                                break
                            }
                        }
                    }
                }

                iframeRef.current.contentWindow.postMessage(
                    'sendPort',
                    e.origin,
                    [channelRef.current.port2]
                )
            }
        }

        window.addEventListener('message', onMessage)

        return () => window.removeEventListener('message', onMessage)
    }, [pluginProps, recordOnNextLoad])

    useEffect(() => {
        // Tell plugin to remove cached data if this dashboard has been removed
        // from offline storage
        if (iframeRef?.current && !isCached) {
            channelRef.current.port1.postMessage(
                JSON.stringify({ type: 'DHIS2', command: 'removeCachedData' })
            )
        }
    }, [isCached])

    useEffect(() => {
        console.log('send props on dep change')
        if (channelRef.current?.port1) {
            channelRef.current.port1.postMessage(
                JSON.stringify({
                    type: 'DHIS2',
                    command: 'sendProps',
                    payload: pluginProps,
                })
            )
        }
    }, [pluginProps])

    useEffect(() => {
        setError(null)
    }, [filterVersion, visualization.type])

    const getIframeSrc = useCallback(() => {
        const pluginType = [CHART, REPORT_TABLE].includes(activeType)
            ? VISUALIZATION
            : activeType

        // 1. check if there is an override for the plugin
        const pluginOverrides = getPluginOverrides()

        if (pluginOverrides && pluginOverrides[pluginType]) {
            return pluginOverrides[pluginType]
        }

        // 2. check if there is an installed app for the pluginType
        // and use its plugin launch URL
        const pluginLaunchUrl = getPluginLaunchUrl(pluginType, d2)

        if (pluginLaunchUrl) {
            return pluginLaunchUrl
        }

        setError('missing-plugin')

        return
    }, [activeType, d2])

    if (error) {
        return error === 'missing-plugin' ? (
            <div style={style}>
                <MissingPluginMessage
                    item={item}
                    dashboardMode={dashboardMode}
                />
            </div>
        ) : (
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
    activeType: PropTypes.string,
    dashboardId: PropTypes.string,
    dashboardMode: PropTypes.string,
    filterVersion: PropTypes.string,
    item: PropTypes.object,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

export default IframePlugin
