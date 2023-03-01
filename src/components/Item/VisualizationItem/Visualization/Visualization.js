import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { Button, Cover, IconInfo24, colors } from '@dhis2/ui'
import uniqueId from 'lodash/uniqueId.js'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
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
import IframePlugin from './IframePlugin.js'
import LegacyPlugin from './LegacyPlugin.js'
import MapPlugin from './MapPlugin.js'
import NoVisualizationMessage from './NoVisualizationMessage.js'
import { pluginIsAvailable } from './plugin.js'
import classes from './styles/Visualization.module.css'

const Visualization = ({
    visualization,
    activeType,
    item,
    itemFilters,
    availableHeight,
    availableWidth,
    dashboardMode,
    originalType,
    showNoFiltersOverlay,
    onClickNoFiltersOverlay,
    ...rest
}) => {
    const { d2 } = useD2()
    const dashboardId = useSelector(sGetSelectedId)

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

    const visualizationConfig = useMemo(
        () => getVisualizationConfig(visualization, originalType, activeType),
        [visualization, activeType, originalType]
    )

    const filteredVisualization = useMemo(
        () =>
            getFilteredVisualization(
                visualizationConfig,
                itemFilters,
                originalType
            ),
        [visualizationConfig, itemFilters, originalType]
    )

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
        ]
    )

    if (!visualization) {
        return <NoVisualizationMessage message={i18n.t('No data to display')} />
    }

    switch (activeType) {
        case CHART:
        case REPORT_TABLE:
        case VISUALIZATION: {
            return (
                <IframePlugin
                    visualization={filteredVisualization}
                    {...iFramePluginProps}
                />
            )
        }
        case EVENT_VISUALIZATION: {
            return (
                <>
                    {showNoFiltersOverlay ? (
                        <Cover>
                            <div className={classes.noFiltersOverlay}>
                                <IconInfo24 color={colors.grey500} />
                                {i18n.t(
                                    'Filters are not applied to line list dashboard items.'
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
                    ) : null}
                    <IframePlugin
                        visualization={visualizationConfig}
                        {...iFramePluginProps}
                    />
                </>
            )
        }

        case MAP: {
            return (
                <MapPlugin
                    visualization={filteredVisualization}
                    {...iFramePluginProps}
                />
            )
        }
        default: {
            return pluginIsAvailable(activeType || item.type, d2) ? (
                <LegacyPlugin
                    item={item}
                    activeType={activeType}
                    visualization={filteredVisualization}
                    filterVersion={filterVersion}
                    style={style}
                    {...rest}
                />
            ) : (
                <NoVisualizationMessage
                    message={i18n.t('Unable to load the plugin for this item')}
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
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    originalType: PropTypes.string,
    showNoFiltersOverlay: PropTypes.bool,
    visualization: PropTypes.object,
    onClickNoFiltersOverlay: PropTypes.func,
}

export default Visualization
