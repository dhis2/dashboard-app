import { useCachedDataQuery } from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
// eslint-disable-next-line import/no-unresolved
import { Plugin } from '@dhis2/app-runtime/experimental'
import { CenteredContent, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { acAddIframePluginStatus } from '../../../../actions/iframePluginStatus.js'
import {
    CHART,
    REPORT_TABLE,
    VISUALIZATION,
    getAppName,
} from '../../../../modules/itemTypes.js'
import { getPluginOverrides } from '../../../../modules/localStorage.js'
import { useCacheableSection } from '../../../../modules/useCacheableSection.js'
import {
    INSTALLATION_STATUS_INSTALLING,
    INSTALLATION_STATUS_UNKNOWN,
    sGetIframePluginStatus,
} from '../../../../reducers/iframePluginStatus.js'
import { useUserSettings } from '../../../UserSettingsProvider.js'
import MissingPluginMessage from '../../ItemMessage/MissingPluginMessage.js'
import VisualizationErrorMessage from '../../ItemMessage/VisualizationErrorMessage.js'
import { getPluginLaunchUrl } from './plugin.js'
import classes from './styles/IframePlugin.module.css'

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
    const iframePluginStatus = useSelector(sGetIframePluginStatus, shallowEqual)
    const { baseUrl } = useConfig()
    const { userSettings } = useUserSettings()
    const [error, setError] = useState(null)
    const { apps } = useCachedDataQuery()

    // When this mounts, check if the dashboard is recording
    const { isCached } = useCacheableSection(dashboardId)

    const pluginType = [CHART, REPORT_TABLE].includes(activeType)
        ? VISUALIZATION
        : activeType

    const onError = () => setError('plugin')
    const onInstallationStatusChange = useCallback(
        (installationStatus) => {
            console.log('DS installation status change', installationStatus)
            if (isFirstOfType) {
                dispatch(
                    acAddIframePluginStatus({
                        pluginType,
                        status: installationStatus,
                    })
                )
            }
        },
        [dispatch, isFirstOfType, pluginType]
    )

    const pluginProps = useMemo(
        () => ({
            isVisualizationLoaded: true,
            forDashboard: true,
            displayProperty: userSettings.keyAnalysisDisplayProperty,
            visualization,
            onError,
            onInstallationStatusChange,

            // For caching: ---
            // Add user & dashboard IDs to cache ID to avoid removing a cached
            // plugin that might be used in another dashboard also
            // TODO: May also want user ID too for multi-user situations
            cacheId: `${dashboardId}-${itemId}`,
            isParentCached: isCached,
        }),
        [
            userSettings,
            visualization,
            dashboardId,
            itemId,
            isCached,
            onInstallationStatusChange,
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
        setError(null)
    }, [filterVersion, visualization.type])

    if (error) {
        return error === 'missing-plugin' ? (
            <div style={style}>
                <MissingPluginMessage
                    pluginName={getAppName(itemType)}
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
                <Plugin
                    pluginSource={iframeSrc}
                    hasFixedDimensions={true}
                    width={style.width}
                    height={style.height}
                    {...pluginProps}
                />
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
