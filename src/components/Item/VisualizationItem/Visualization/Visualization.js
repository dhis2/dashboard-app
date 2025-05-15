import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Cover, IconInfo24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
    isDVVersionCompatible,
    isLLVersionCompatible,
    isMapsVersionCompatible,
    minDVVersion,
    minLLVersion,
    minMapsVersion,
} from '../../../../modules/isAppVersionCompatible.js'
import {
    VISUALIZATION,
    EVENT_VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
} from '../../../../modules/itemTypes.js'
import { sGetSelectedId } from '../../../../reducers/selected.js'
import {
    useInstalledApps,
    useInstalledDVVersion,
    useInstalledLLVersion,
    useInstalledMapsVersion,
} from '../../../AppDataProvider/AppDataProvider.js'
import getFilteredVisualization from './getFilteredVisualization.js'
import getVisualizationConfig from './getVisualizationConfig.js'
import IframePlugin from './IframePlugin.js'
import LegacyPlugin from './LegacyPlugin.js'
import { pluginIsAvailable } from './plugin.js'
import { PluginWarningMessage } from './PluginWarningMessage.js'
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
    ...rest
}) => {
    const dashboardId = useSelector(sGetSelectedId)
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const apps = useInstalledApps()
    const dataVisualizerAppVersion = useInstalledDVVersion()
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
        ]
    )

    if (!visualization) {
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
                        `Install Data Visualizer app ${minDVVersion.join(
                            '.'
                        )} or higher in order to display this item.`
                    )}
                />
            )
        }
        case EVENT_VISUALIZATION: {
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
                        `Install Line Listing app ${minLLVersion.join(
                            '.'
                        )} or higher in order to display this item.`
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
                        `Install Maps app ${minMapsVersion.join(
                            '.'
                        )} or higher in order to display this item.`
                    )}
                />
            )
        }
        default: {
            return !pluginIsAvailable(activeType || item.type, apps) ? (
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
                    {...rest}
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
