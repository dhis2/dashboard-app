import { useConfig, useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
    isDVVersionCompatible,
    isMapsVersionCompatible,
    minDVVersion,
    minMapsVersion,
} from '../../../../modules/isAppVersionCompatible.js'
import { getVisualizationId } from '../../../../modules/item.js'
import {
    VISUALIZATION,
    EVENT_VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
    getAppName,
} from '../../../../modules/itemTypes.js'
import { sGetSelectedId } from '../../../../reducers/selected.js'
import {
    useInstalledApps,
    useInstalledDVVersion,
    useInstalledMapsVersion,
} from '../../../AppDataProvider/AppDataProvider.jsx'
import EventVisualizationPlugin from './EventVisualizationPlugin.jsx'
import getFilteredVisualization from './getFilteredVisualization.js'
import getVisualizationConfig from './getVisualizationConfig.js'
import IframePlugin from './IframePlugin.jsx'
import LegacyPlugin from './LegacyPlugin.jsx'
import MapPlugin from './MapPlugin.jsx'
import { hasStandalonePlugin, pluginIsAvailable } from './plugin.js'
import { PluginWarningMessage } from './PluginWarningMessage.jsx'

const Visualization = ({
    visualization,
    activeType,
    item,
    itemFilters,
    style,
    gridWidth,
    dashboardMode,
    originalType,
    showNoFiltersOverlay,
    onClickNoFiltersOverlay,
}) => {
    const { baseUrl, apiVersion } = useConfig()
    const dashboardId = useSelector(sGetSelectedId)
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const apps = useInstalledApps()
    const dataVisualizerAppVersion = useInstalledDVVersion()
    const mapsAppVersion = useInstalledMapsVersion()

    const visualizationConfig = useMemo(() => {
        if (originalType === EVENT_VISUALIZATION) {
            return visualization
        }

        return getFilteredVisualization(
            getVisualizationConfig(visualization, originalType, activeType),
            itemFilters
        )
    }, [visualization, activeType, originalType, itemFilters])

    const visualizationId = getVisualizationId(item)

    const iFramePluginProps = useMemo(
        () => ({
            originalType,
            activeType,
            style,
            dashboardMode,
            dashboardId,
            itemId: item.id,
            itemType: item.type,
            isFirstOfType: Boolean(item.firstOfType),
            visualizationId,
            filters: itemFilters,
        }),
        [
            originalType,
            activeType,
            style,
            dashboardMode,
            dashboardId,
            item.id,
            item.type,
            item.firstOfType,
            visualizationId,
            itemFilters,
        ]
    )

    if (!hasStandalonePlugin(activeType, apiVersion) && !visualization) {
        return (
            <PluginWarningMessage
                style={style}
                message={i18n.t('No data to display')}
            />
        )
    }

    switch (activeType) {
        case CHART:
        case REPORT_TABLE:
        case VISUALIZATION: {
            return isDVVersionCompatible(dataVisualizerAppVersion) ? (
                <IframePlugin
                    visualization={visualizationConfig}
                    {...iFramePluginProps}
                />
            ) : (
                <PluginWarningMessage
                    style={style}
                    message={i18n.t(
                        `Install {{appName}} app {{appVersion}} or higher in order to display this item.`,
                        {
                            appName: getAppName(activeType, apiVersion),
                            appVersion: minDVVersion.join('.'),
                        }
                    )}
                />
            )
        }
        case EVENT_VISUALIZATION: {
            return (
                <EventVisualizationPlugin
                    visualization={visualizationConfig}
                    iFramePluginProps={iFramePluginProps}
                    style={style}
                    showNoFiltersOverlay={showNoFiltersOverlay}
                    onClickNoFiltersOverlay={onClickNoFiltersOverlay}
                />
            )
        }
        case MAP: {
            return isMapsVersionCompatible(mapsAppVersion) ? (
                <MapPlugin
                    offline={offline}
                    visualization={visualizationConfig}
                    iFramePluginProps={iFramePluginProps}
                    style={style}
                />
            ) : (
                <PluginWarningMessage
                    style={style}
                    message={i18n.t(
                        `Install {{appName}} app {{appVersion}} or higher in order to display this item.`,
                        {
                            appName: getAppName(activeType, apiVersion),
                            appVersion: minMapsVersion.join('.'),
                        }
                    )}
                />
            )
        }
        default: {
            return !pluginIsAvailable({
                type: activeType || item.type,
                apps,
                baseUrl,
                apiVersion,
            }) ? (
                <PluginWarningMessage
                    style={style}
                    message={i18n.t('Unable to load the plugin for this item')}
                />
            ) : (
                <LegacyPlugin
                    item={item}
                    activeType={activeType}
                    visualization={visualizationConfig}
                    style={style}
                    gridWidth={gridWidth}
                />
            )
        }
    }
}

Visualization.propTypes = {
    activeType: PropTypes.string,
    dashboardMode: PropTypes.string,
    gridWidth: PropTypes.number,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    originalType: PropTypes.string,
    showNoFiltersOverlay: PropTypes.bool,
    style: PropTypes.object,
    visualization: PropTypes.object,
    onClickNoFiltersOverlay: PropTypes.func,
}

export default Visualization
