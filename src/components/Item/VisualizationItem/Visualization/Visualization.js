import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import VisualizationPlugin from '@dhis2/data-visualizer-plugin'
import i18n from '@dhis2/d2-i18n'

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
                        <VisualizationPlugin
                            d2={this.context.d2}
                            visualization={this.memoizedGetFilteredVisualization(
                                pluginProps.visualization,
                                pluginProps.itemFilters
                            )}
                            onLoadingComplete={this.onLoadingComplete}
                            forDashboard={true}
                            style={pluginProps.style}
                        />
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

                return <DefaultPlugin {...pluginProps} />
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

Visualization.contextTypes = {
    d2: PropTypes.object,
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
