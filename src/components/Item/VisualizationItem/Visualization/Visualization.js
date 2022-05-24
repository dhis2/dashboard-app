import i18n from '@dhis2/d2-i18n'
import uniqueId from 'lodash/uniqueId.js'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { isEditMode } from '../../../../modules/dashboardModes.js'
import { getVisualizationId } from '../../../../modules/item.js'
import {
    VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
    getItemTypeForVis,
} from '../../../../modules/itemTypes.js'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../../reducers/itemFilters.js'
import { sGetVisualization } from '../../../../reducers/visualizations.js'
import memoizeOne from '../memoizeOne.js'
import DataVisualizerPlugin from './DataVisualizerPlugin.js'
import getFilteredVisualization from './getFilteredVisualization.js'
import getVisualizationConfig from './getVisualizationConfig.js'
import LegacyPlugin from './LegacyPlugin.js'
import MapPlugin from './MapPlugin.js'
import NoVisualizationMessage from './NoVisualizationMessage.js'
import { pluginIsAvailable } from './plugin.js'

class Visualization extends React.Component {
    constructor(props) {
        super(props)

        this.memoizedGetFilteredVisualization = memoizeOne(
            getFilteredVisualization
        )
        this.memoizedGetVisualizationConfig = memoizeOne(getVisualizationConfig)

        this.getFilterVersion = memoizeOne(() => uniqueId())
    }

    render() {
        const { visualization, activeType, item, itemFilters, ...rest } =
            this.props

        if (!visualization) {
            return (
                <NoVisualizationMessage
                    message={i18n.t('No data to display')}
                />
            )
        }

        const style = { height: this.props.availableHeight }
        if (this.props.availableWidth) {
            style.width = this.props.availableWidth
        }

        const visualizationConfig = this.memoizedGetVisualizationConfig(
            visualization,
            getItemTypeForVis(item),
            activeType
        )

        const filterVersion = this.getFilterVersion(itemFilters)

        switch (activeType) {
            case VISUALIZATION:
            case CHART:
            case REPORT_TABLE: {
                return (
                    <DataVisualizerPlugin
                        visualization={this.memoizedGetFilteredVisualization(
                            visualizationConfig,
                            itemFilters
                        )}
                        style={style}
                        filterVersion={filterVersion}
                        item={item}
                        dashboardMode={this.props.dashboardMode}
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
                        applyFilters={this.memoizedGetFilteredVisualization}
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
                        visualization={this.memoizedGetFilteredVisualization(
                            visualizationConfig,
                            itemFilters
                        )}
                        filterVersion={filterVersion}
                        style={style}
                        {...rest}
                    />
                ) : (
                    <NoVisualizationMessage
                        message={i18n.t(
                            'Unable to load the plugin for this item'
                        )}
                    />
                )
            }
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
    visualization: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
    const itemFilters = !isEditMode(ownProps.dashboardMode)
        ? sGetItemFiltersRoot(state)
        : DEFAULT_STATE_ITEM_FILTERS

    return {
        itemFilters,
        visualization: sGetVisualization(
            state,
            getVisualizationId(ownProps.item)
        ),
    }
}

export default connect(mapStateToProps)(Visualization)
