import i18n from '@dhis2/d2-i18n'
import uniqueId from 'lodash/uniqueId'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { isEditMode } from '../../../../modules/dashboardModes'
import { getVisualizationId } from '../../../../modules/item'
import {
    VISUALIZATION,
    EVENT_VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
    getItemTypeForVis,
} from '../../../../modules/itemTypes'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../../reducers/itemFilters.js'
import { sGetSelected } from '../../../../reducers/selected.js'
import { sGetVisualization } from '../../../../reducers/visualizations.js'
import memoizeOne from '../memoizeOne.js'
import DataVisualizerPlugin from './DataVisualizerPlugin.js'
import getFilteredVisualization from './getFilteredVisualization.js'
import getVisualizationConfig from './getVisualizationConfig.js'
import IframePlugin from './IframePlugin.js'
import LegacyPlugin from './LegacyPlugin.js'
import MapPlugin from './MapPlugin.js'
import NoVisualizationMessage from './NoVisualizationMessage.js'
import { pluginIsAvailable } from './plugin.js'

const Visualization = ({
    visualization,
    activeType,
    item,
    itemFilters,
    availableHeight,
    availableWidth,
    dashboardMode,
    dashboardId,
    ...rest
}) => {
    const memoizedGetFilteredVisualization = memoizeOne(
        getFilteredVisualization
    )
    const memoizedGetVisualizationConfig = memoizeOne(getVisualizationConfig)

    const getFilterVersion = memoizeOne(() => uniqueId())

    if (!visualization) {
        return <NoVisualizationMessage message={i18n.t('No data to display')} />
    }

    const style = { height: availableHeight }
    if (availableWidth) {
        style.width = availableWidth
    }

    const visualizationConfig = memoizedGetVisualizationConfig(
        visualization,
        getItemTypeForVis(item),
        activeType
    )

    const filterVersion = getFilterVersion(itemFilters)

    switch (activeType) {
        case VISUALIZATION:
        case CHART:
        case REPORT_TABLE: {
            return (
                <DataVisualizerPlugin
                    visualization={memoizedGetFilteredVisualization(
                        visualizationConfig,
                        itemFilters
                    )}
                    style={style}
                    filterVersion={filterVersion}
                    item={item}
                    dashboardMode={dashboardMode}
                />
            )
        }
        case EVENT_VISUALIZATION: {
            return (
                <IframePlugin
                    visualization={visualizationConfig}
                    style={style}
                    item={item}
                    dashboardMode={dashboardMode}
                    dashboardId={dashboardId}
                />
            )
        }
        case MAP: {
            return (
                <MapPlugin
                    item={item}
                    activeType={activeType}
                    visualization={visualizationConfig}
                    itemFilters={itemFilters}
                    applyFilters={memoizedGetFilteredVisualization}
                    filterVersion={filterVersion}
                    style={style}
                    {...rest}
                />
            )
        }
        default: {
            return pluginIsAvailable(activeType || item.type) ? (
                <LegacyPlugin
                    item={item}
                    activeType={activeType}
                    visualization={memoizedGetFilteredVisualization(
                        visualizationConfig,
                        itemFilters
                    )}
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
    dashboardId: PropTypes.string,
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    visualization: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
    const itemFilters = !isEditMode(ownProps.dashboardMode)
        ? sGetItemFiltersRoot(state)
        : DEFAULT_STATE_ITEM_FILTERS

    return {
        dashboardId: sGetSelected(state).id,
        itemFilters,
        visualization: sGetVisualization(
            state,
            getVisualizationId(ownProps.item)
        ),
    }
}

export default connect(mapStateToProps)(Visualization)
