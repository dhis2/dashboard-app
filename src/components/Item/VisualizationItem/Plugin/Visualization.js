import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import DataVisualizerPlugin from '@dhis2/data-visualizer-plugin'
import i18n from '@dhis2/d2-i18n'

import usePrevious from './usePrevious'
import DefaultPlugin from './DefaultPlugin'
import MapPlugin from './MapPlugin'
import LoadingMask from './LoadingMask'
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

    // TODO: does it have to be this way??
    const previousVis = usePrevious(visualization)
    const previousItemFilters = usePrevious(itemFilters)
    const previousPluginIsLoaded = usePrevious(pluginIsLoaded)

    // componentDidUpdate
    useEffect(() => {
        if (
            previousPluginIsLoaded &&
            (previousVis !== visualization ||
                previousItemFilters !== itemFilters)
        ) {
            setPluginIsLoaded(false)
        }
    }, [pluginIsLoaded, visualization, itemFilters])

    const memoizedGetFilteredVis = useCallback(getFilteredVisualization, [
        visualization,
        itemFilters,
    ])
    const theprops = {
        item,
        itemFilters,
        activeType,
        visualization,
        style,
    }

    const onLoadingComplete = () => setPluginIsLoaded(true)

    switch (activeType) {
        case VISUALIZATION:
        case CHART:
        case REPORT_TABLE: {
            return (
                <>
                    {!pluginIsLoaded && (
                        <div style={style}>
                            <LoadingMask />
                        </div>
                    )}
                    <DataVisualizerPlugin
                        d2={context.d2}
                        visualization={memoizedGetFilteredVis(
                            visualization,
                            itemFilters
                        )}
                        onLoadingComplete={onLoadingComplete}
                        forDashboard={true}
                        style={style}
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
                itemFilters
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
