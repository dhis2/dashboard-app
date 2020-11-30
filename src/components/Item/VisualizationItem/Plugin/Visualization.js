import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import DVPlugin from '@dhis2/data-visualizer-plugin'
import i18n from '@dhis2/d2-i18n'

import DefaultPlugin from './DefaultPlugin'
import MapPlugin from './MapPlugin'
import LoadingMask from '../LoadingMask'
import NoVisualizationMessage from './NoVisualizationMessage'
import {
    VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
} from '../../../../modules/itemTypes'
import getFilteredVisualization from './getFilteredVisualization'

const VisualizationPlugin = (
    { activeType, visualization, style, item, itemFilters },
    context
) => {
    if (!visualization) {
        return <NoVisualizationMessage message={i18n.t('No data to display')} />
    }
    const [pluginIsLoaded, setPluginIsLoaded] = useState(false)

    // componentDidUpdate
    // useEffect(() => {
    // if (
    //     pluginIsLoaded &&
    //     (prevProps.visualization !== this.props.visualization ||
    //         prevProps.itemFilters !== this.props.itemFilters)
    // ) {
    //     setPluginIsLoaded(false)
    // }
    // }, [pluginIsLoaded, visualization, itemFilters])

    const memoizedGetFilteredVis = useCallback(getFilteredVisualization, [
        visualization,
        itemFilters,
    ])
    const theprops = {
        item: item,
        itemFilters: itemFilters,
        activeType,
        visualization,
        style: style,
    }

    const onLoadingComplete = () => setPluginIsLoaded(true)

    switch (activeType) {
        case VISUALIZATION:
        case CHART:
        case REPORT_TABLE: {
            return (
                <>
                    {!pluginIsLoaded && (
                        <div style={theprops.style}>
                            <LoadingMask />
                        </div>
                    )}
                    <DVPlugin
                        d2={context.d2}
                        visualization={memoizedGetFilteredVis(
                            visualization,
                            theprops.itemFilters
                        )}
                        onLoadingComplete={onLoadingComplete}
                        forDashboard={true}
                        style={theprops.style}
                    />
                </>
            )
        }
        case MAP: {
            return (
                <MapPlugin
                    getFilteredVisualization={memoizedGetFilteredVis}
                    {...theprops}
                />
            )
        }
        default: {
            theprops.visualization = memoizedGetFilteredVis(
                theprops.visualization,
                theprops.itemFilters
            )

            return <DefaultPlugin {...theprops} />
        }
    }
}

VisualizationPlugin.contextTypes = {
    d2: PropTypes.object,
}

VisualizationPlugin.propTypes = {
    activeType: PropTypes.string,
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    visualization: PropTypes.object,
}

export default VisualizationPlugin
