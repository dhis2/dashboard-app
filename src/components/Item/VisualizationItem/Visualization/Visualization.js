import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import VisualizationPlugin from '@dhis2/data-visualizer-plugin'
import i18n from '@dhis2/d2-i18n'
import { D2Shim } from '@dhis2/app-runtime-adapter-d2'

import DefaultPlugin from './DefaultPlugin'
import MapPlugin from './MapPlugin'
import LoadingMask from './LoadingMask'
import NoVisualizationMessage from './NoVisualizationMessage'

import getFilteredVisualization from './getFilteredVisualization'
import getVisualizationConfig from './getVisualizationConfig'
import {
    VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
} from '../../../../modules/itemTypes'
import { getVisualizationId } from '../../../../modules/item'
import memoizeOne from '../../../../modules/memoizeOne'
import { sGetVisualization } from '../../../../reducers/visualizations'
import { pluginIsAvailable } from './plugin'

class Visualization extends React.Component {
    state = {
        pluginLoaded: false,
    }

    constructor(props) {
        super(props)

        this.memoizedGetFilteredVisualization = memoizeOne(
            getFilteredVisualization
        )
        this.memoizedGetVisualizationConfig = memoizeOne(getVisualizationConfig)
    }

    onLoadingComplete = () => {
        this.setState({ pluginLoaded: true })
    }

    render() {
        const {
            visualization,
            activeType,
            item,
            itemFilters,
            availableHeight,
        } = this.props

        if (!visualization) {
            return (
                <NoVisualizationMessage
                    message={i18n.t('No data to display')}
                />
            )
        }

        const pluginProps = {
            item,
            itemFilters,
            activeType,
            style: { height: availableHeight },
            visualization: this.memoizedGetVisualizationConfig(
                visualization,
                item.type,
                activeType
            ),
        }

        switch (activeType) {
            case VISUALIZATION:
            case CHART:
            case REPORT_TABLE: {
                return (
                    <>
                        {!this.state.pluginLoaded && (
                            <div style={pluginProps.style}>
                                <LoadingMask />
                            </div>
                        )}
                        <D2Shim d2Config={{}}>
                            {({ d2 }) => (
                                <VisualizationPlugin
                                    d2={d2}
                                    visualization={this.memoizedGetFilteredVisualization(
                                        pluginProps.visualization,
                                        pluginProps.itemFilters
                                    )}
                                    onLoadingComplete={this.onLoadingComplete}
                                    forDashboard={true}
                                    style={pluginProps.style}
                                />
                            )}
                        </D2Shim>
                    </>
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
                    <DefaultPlugin {...pluginProps} />
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
