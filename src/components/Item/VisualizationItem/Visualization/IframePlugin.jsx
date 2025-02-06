import { useCachedDataQuery } from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
import { CenteredContent, CircularLoader } from '@dhis2/ui'
import postRobot from '@krakenjs/post-robot'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { acAddIframePluginStatus } from '../../../../actions/iframePluginStatus.js'
import {
    CHART,
    REPORT_TABLE,
    VISUALIZATION,
} from '../../../../modules/itemTypes.js'
import { getPluginOverrides } from '../../../../modules/localStorage.js'
import { useCacheableSection } from '../../../../modules/useCacheableSection.js'
import {
    INSTALLATION_STATUS_INSTALLING,
    INSTALLATION_STATUS_READY,
    INSTALLATION_STATUS_UNKNOWN,
    INSTALLATION_STATUS_WILL_NOT_INSTALL,
    sGetIframePluginStatus,
} from '../../../../reducers/iframePluginStatus.js'
import { useUserSettings } from '../../../UserSettingsProvider.jsx'
import MissingPluginMessage from './MissingPluginMessage.jsx'
import { getPluginLaunchUrl } from './plugin.js'
import classes from './styles/IframePlugin.module.css'
import VisualizationErrorMessage from './VisualizationErrorMessage.jsx'

const IframePlugin = ({
    activeType,
    filterVersion,
    style,
    visualization,
    dashboardMode,
    dashboardId,
    itemId,
    itemType,
    isFirstOfType,
}) => {
    const dispatch = useDispatch()
    const iframePluginStatus = useSelector(sGetIframePluginStatus)
    const { baseUrl } = useConfig()
    const { userSettings } = useUserSettings()
    const iframeRef = useRef()
    const [error, setError] = useState(null)
    const { apps } = useCachedDataQuery()

    // When this mounts, check if the dashboard is recording
    const { isCached, recordingState } = useCacheableSection(dashboardId)
    const [recordOnNextLoad, setRecordOnNextLoad] = useState(
        recordingState === 'recording'
    )

    const prevPluginRef = useRef()

    const onError = () => setError('plugin')

    const pluginType = [CHART, REPORT_TABLE].includes(activeType)
        ? VISUALIZATION
        : activeType
    const installationStatus = iframePluginStatus[pluginType]

    const pluginProps = useMemo(
        () => ({
            isVisualizationLoaded: true,
            forDashboard: true,
            displayProperty: userSettings.keyAnalysisDisplayProperty,
            visualization,
            onError,

            // For caching: ---
            // Add user & dashboard IDs to cache ID to avoid removing a cached
            // plugin that might be used in another dashboard also
            // TODO: May also want user ID too for multi-user situations
            cacheId: `${dashboardId}-${itemId}`,
            isParentCached: isCached,
            recordOnNextLoad,
        }),
        [
            userSettings,
            visualization,
            dashboardId,
            itemId,
            isCached,
            recordOnNextLoad,
        ]
    )

    const getIframeSrc = useCallback(() => {
        // 1. check if there is an override for the plugin
        const pluginOverrides = getPluginOverrides()

        if (pluginOverrides && pluginOverrides[pluginType]) {
            return pluginOverrides[pluginType]
        }

        // 2. check if there is an installed app for the pluginType
        // and use its plugin launch URL
        const pluginLaunchUrl = getPluginLaunchUrl(pluginType, apps, baseUrl)

        if (pluginLaunchUrl) {
            return pluginLaunchUrl
        }

        setError('missing-plugin')
    }, [apps, baseUrl, pluginType])

    const iframeSrc = getIframeSrc()

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
        if (
            iframeRef?.current &&
            (installationStatus === INSTALLATION_STATUS_READY ||
                installationStatus === INSTALLATION_STATUS_WILL_NOT_INSTALL ||
                isFirstOfType)
        ) {
            // if iframe has not sent initial request, set up a listener
            if (iframeSrc !== prevPluginRef.current) {
                prevPluginRef.current = iframeSrc

                const listener = postRobot.on(
                    'getProps',
                    // listen for messages coming only from the iframe rendered by this component
                    { window: iframeRef.current.contentWindow },
                    () => {
                        if (recordOnNextLoad) {
                            // Avoid recording unnecessarily,
                            // e.g. if plugin re-requests props for some reason
                            setRecordOnNextLoad(false)
                        }
                        return pluginProps
                    }
                )

                return () => listener.cancel()
            } else {
                postRobot.send(
                    iframeRef.current.contentWindow,
                    'newProps',
                    pluginProps
                )
            }
        }
    }, [
        recordOnNextLoad,
        pluginProps,
        iframeSrc,
        installationStatus,
        isFirstOfType,
    ])

    useEffect(() => {
        if (iframeRef?.current) {
            const listener = postRobot.on(
                'installationStatus',
                {
                    window: iframeRef.current.contentWindow,
                },
                (event) => {
                    if (isFirstOfType) {
                        dispatch(
                            acAddIframePluginStatus({
                                pluginType,
                                status: event.data.installationStatus,
                            })
                        )
                    }
                }
            )

            return () => listener.cancel()
        }
    }, [pluginType, dispatch, visualization, iframePluginStatus, isFirstOfType])

    useEffect(() => {
        setError(null)
    }, [filterVersion, visualization.type])

    if (error) {
        return error === 'missing-plugin' ? (
            <div style={style}>
                <MissingPluginMessage
                    itemType={itemType}
                    dashboardMode={dashboardMode}
                />
            </div>
        ) : (
            <div style={style}>
                <VisualizationErrorMessage
                    itemType={itemType}
                    visualizationId={visualization.id}
                    dashboardMode={dashboardMode}
                />
            </div>
        )
    }

    if (
        [INSTALLATION_STATUS_INSTALLING, INSTALLATION_STATUS_UNKNOWN].includes(
            iframePluginStatus[pluginType]
        ) &&
        !isFirstOfType
    ) {
        return (
            <div
                style={{
                    width: style.width || '100%',
                    height: style.height || '100%',
                }}
            >
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </div>
        )
    }

    return (
        <div className={classes.wrapper} dir={document.dir}>
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
    isFirstOfType: PropTypes.bool,
    itemId: PropTypes.string,
    itemType: PropTypes.string,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

// Memoize the whole component to avoid re-rendering when the parent component re-renders.
// This happens when the interpretations panel is toggled because the `item` prop changes (height)
// causing the `Item` component to re-render.

export default React.memo(IframePlugin)
