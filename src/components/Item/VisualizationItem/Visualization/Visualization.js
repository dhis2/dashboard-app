import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'

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

class Visualization extends React.Component {
    constructor(props) {
        super(props)

        this.memoizedGetFilteredVisualization = memoizeOne(
            getFilteredVisualization
        )
        this.memoizedGetVisualizationConfig = memoizeOne(getVisualizationConfig)
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

        const pluginProps = {
            item,
            itemFilters,
            activeType,
            style,
            visualization: this.memoizedGetVisualizationConfig(
                visualization,
                item.type,
                activeType
            ),
            ...rest,
        }

        switch (activeType) {
            case VISUALIZATION:
            case CHART:
            case REPORT_TABLE: {
                return (
                    <DataVisualizerPlugin
                        visualization={this.memoizedGetFilteredVisualization(
                            pluginProps.visualization,
                            pluginProps.itemFilters
                        )}
                        style={pluginProps.style}
                    />
                )
            }
            case MAP: {
                return (
                    <MapPlugin
                        applyFilters={this.memoizedGetFilteredVisualization}
                        {...pluginProps}
                    />
                )
            }
            default: {
                pluginProps.visualization = this.memoizedGetFilteredVisualization(
                    pluginProps.visualization,
                    pluginProps.itemFilters
                )

                return pluginIsAvailable(
                    pluginProps.activeType || pluginProps.item.type
                ) ? (
                    <LegacyPlugin {...pluginProps} />
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
    return {
        visualization: sGetVisualization(
            state,
            getVisualizationId(ownProps.item)
        ),
    }
}

export default connect(mapStateToProps)(Visualization)
