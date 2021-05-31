import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import uniqueId from 'lodash/uniqueId'

import LegacyPlugin from './LegacyPlugin'
import MapPlugin from './MapPlugin'
import DataVisualizerPlugin from './DataVisualizerPlugin'
import NoVisualizationMessage from './NoVisualizationMessage'

import getFilteredVisualization from './getFilteredVisualization'
import { pluginIsAvailable } from './plugin'
import getVisualizationConfig from './getVisualizationConfig'
import memoizeOne from '../memoizeOne'
import {
    VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
} from '../../../../modules/itemTypes'
import { getVisualizationId } from '../../../../modules/item'
import { sGetVisualization } from '../../../../reducers/visualizations'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../../reducers/itemFilters'
import { isEditMode } from '../../../../modules/dashboardModes'

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
        const {
            visualization,
            activeType,
            item,
            itemFilters,
            ...rest
        } = this.props

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
            item.type,
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
