import { useCachedDataQuery } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Cover, IconInfo24, IconWarning24, colors } from '@dhis2/ui'
import uniqueId from 'lodash/uniqueId.js'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
    isLLVersionCompatible,
    minLLVersion,
} from '../../../../modules/isLLVersionCompatible.js'
import {
    VISUALIZATION,
    EVENT_VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
} from '../../../../modules/itemTypes.js'
import { sGetSelectedId } from '../../../../reducers/selected.js'
import getFilteredVisualization from './getFilteredVisualization.js'
import getVisualizationConfig from './getVisualizationConfig.js'
import IframePlugin from './IframePlugin.jsx'
import LegacyPlugin from './LegacyPlugin.jsx'
import { pluginIsAvailable } from './plugin.js'
import classes from './styles/Visualization.module.css'

const mapHasEELayer = (visualization) =>
    visualization.mapViews?.find((mv) => mv.layer.includes('earthEngine'))

const Visualization = ({
    visualization,
    activeType,
    item,
    itemFilters,
    availableHeight,
    availableWidth,
    gridWidth,
    dashboardMode,
    originalType,
    showNoFiltersOverlay,
    onClickNoFiltersOverlay,
    ...rest
}) => {
    const dashboardId = useSelector(sGetSelectedId)
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const { lineListingAppVersion, apps } = useCachedDataQuery()

    // NOTE:
    // The following is all memoized because the IframePlugin (and potentially others)
    // are wrapped in React.memo() to avoid unnecessary re-renders
    // The main problem here was `item` which changes height when the interpretations panel is toggled
    // causing all the chain of components to re-render.
    // The only dependency using `item` is `item.id` which doesn't change so the memoized plugin props
    // should also always be the same regardless of the `item` details.

    const style = useMemo(
        () => ({
            height: availableHeight,
            width: availableWidth || undefined,
        }),
        [availableHeight, availableWidth]
    )

    const visualizationConfig = useMemo(() => {
        if (originalType === EVENT_VISUALIZATION) {
            return visualization
        }

        return getFilteredVisualization(
            getVisualizationConfig(visualization, originalType, activeType),
            itemFilters
        )
    }, [visualization, activeType, originalType, itemFilters])

    const filterVersion = useMemo(() => uniqueId(), [])

    const iFramePluginProps = useMemo(
        () => ({
            originalType,
            activeType,
            style,
            filterVersion,
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
            filterVersion,
            dashboardMode,
            dashboardId,
            item.id,
            item.type,
            item.firstOfType,
        ]
    )

    if (!visualization) {
        return (
            <div style={style}>
                <Cover>
                    <div className={classes.messageContent}>
                        <IconWarning24 color={colors.grey500} />
                        {i18n.t('No data to display')}
                    </div>
                </Cover>
            </div>
        )
    }

    if (
        activeType === EVENT_VISUALIZATION &&
        !isLLVersionCompatible(lineListingAppVersion)
    ) {
        return (
            <div style={style}>
                <Cover>
                    <div className={classes.messageContent}>
                        <IconWarning24 color={colors.grey500} />
                        {i18n.t(
                            `Install Line Listing app version ${minLLVersion.join(
                                '.'
                            )} or higher in order to display this item.`
                        )}
                    </div>
                </Cover>
            </div>
        )
    }

    switch (activeType) {
        case CHART:
        case REPORT_TABLE:
        case VISUALIZATION: {
            return (
                <IframePlugin
                    visualization={visualizationConfig}
                    {...iFramePluginProps}
                />
            )
        }
        case EVENT_VISUALIZATION: {
            return (
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
            )
        }
        case MAP: {
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
        default: {
            return !pluginIsAvailable(activeType || item.type, apps) ? (
                <div style={style}>
                    <Cover>
                        <div className={classes.messageContent}>
                            <IconWarning24 color={colors.grey500} />
                            <span>
                                {i18n.t(
                                    'Unable to load the plugin for this item'
                                )}
                            </span>
                        </div>
                    </Cover>
                </div>
            ) : (
                <LegacyPlugin
                    item={item}
                    activeType={activeType}
                    visualization={visualizationConfig}
                    filterVersion={filterVersion}
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
    availableHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    availableWidth: PropTypes.number,
    dashboardMode: PropTypes.string,
    gridWidth: PropTypes.number,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    originalType: PropTypes.string,
    showNoFiltersOverlay: PropTypes.bool,
    visualization: PropTypes.object,
    onClickNoFiltersOverlay: PropTypes.func,
}

export default Visualization
