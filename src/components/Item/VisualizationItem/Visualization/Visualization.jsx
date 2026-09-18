import { useConfig, useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Cover, IconInfo24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
    isDVVersionCompatible,
    isEVERVersionCompatible,
    isLLVersionCompatible,
    isMapsVersionCompatible,
    minDVVersion,
    minEVERVersion,
    minLLVersion,
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
    useInstalledEVERVersion,
    useInstalledLLVersion,
    useInstalledMapsVersion,
} from '../../../AppDataProvider/AppDataProvider.jsx'
import getFilteredVisualization from './getFilteredVisualization.js'
import getVisualizationConfig from './getVisualizationConfig.js'
import IframePlugin from './IframePlugin.jsx'
import LegacyPlugin from './LegacyPlugin.jsx'
import { hasStandalonePlugin, pluginIsAvailable } from './plugin.js'
import { PluginWarningMessage } from './PluginWarningMessage.jsx'
import classes from './styles/Visualization.module.css'

const mapHasEELayer = (visualization) =>
    visualization.mapViews?.find((mv) => mv.layer.includes('earthEngine'))

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
    const everAppVersion = useInstalledEVERVersion()
    const lineListingAppVersion = useInstalledLLVersion()
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
            if (apiVersion >= 43) {
                return isEVERVersionCompatible(everAppVersion) ? (
                    <IframePlugin {...iFramePluginProps} />
                ) : (
                    <PluginWarningMessage
                        style={style}
                        message={i18n.t(
                            `Install {{appName}} app {{appVersion}} or higher in order to display this item.`,
                            {
                                appName: getAppName(activeType, apiVersion),
                                appVersion: minEVERVersion.join('.'),
                            }
                        )}
                    />
                )
            }

            return isLLVersionCompatible(lineListingAppVersion) ? (
                <>
                    {showNoFiltersOverlay ? (
                        <div style={style}>
                            <Cover>
                                <div className={classes.messageContent}>
                                    <IconInfo24 color={colors.grey500} />
                                    {i18n.t(
                                        'Filters are not applied to line list dashboard items'
                                    )}
                                    <Button
                                        secondary
                                        small
                                        onClick={onClickNoFiltersOverlay}
                                    >
                                        {i18n.t('Show without filters')}
                                    </Button>
                                </div>
                            </Cover>
                        </div>
                    ) : null}
                    <IframePlugin
                        visualization={visualizationConfig}
                        {...iFramePluginProps}
                    />
                </>
            ) : (
                <PluginWarningMessage
                    style={style}
                    message={i18n.t(
                        `Install {{appName}} app {{appVersion}} or higher in order to display this item.`,
                        {
                            appName: getAppName(activeType, apiVersion),
                            appVersion: minLLVersion.join('.'),
                        }
                    )}
                />
            )
        }
        case MAP: {
            const getMapComponent = () => {
                return offline && mapHasEELayer(visualizationConfig) ? (
                    <div style={style}>
                        <Cover>
                            <div className={classes.messageContent}>
                                <IconInfo24 color={colors.grey500} />
                                <span>
                                    {i18n.t(
                                        'Maps with Earth Engine layers cannot be displayed when offline'
                                    )}
                                </span>
                            </div>
                        </Cover>
                    </div>
                ) : (
                    <IframePlugin
                        visualization={visualizationConfig}
                        {...iFramePluginProps}
                    />
                )
            }

            return isMapsVersionCompatible(mapsAppVersion) ? (
                getMapComponent()
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
