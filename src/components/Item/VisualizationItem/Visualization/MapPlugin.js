import { useOnlineStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { MAP } from '../../../../modules/itemTypes.js'
import IframePlugin from './IframePlugin.js'
import NoVisualizationMessage from './NoVisualizationMessage.js'

const mapViewIsThematicOrEvent = (mapView) =>
    mapView.layer.includes('thematic') || mapView.layer.includes('event')

const mapViewIsEELayer = (mapView) => mapView.layer.includes('earthEngine')

const MapPlugin = ({
    applyFilters,
    item,
    itemFilters,
    visualization,
    ...pluginProps
}) => {
    const { offline } = useOnlineStatus()

    const getVisualization = useCallback(() => {
        if (item.type === MAP) {
            // apply filters only to thematic and event layers
            // for maps AO

            const mapViews = visualization.mapViews.map((mapView) => {
                if (mapViewIsThematicOrEvent(mapView)) {
                    return applyFilters(mapView, itemFilters)
                }

                return mapView
            })

            return {
                ...visualization,
                mapViews,
            }
        } else {
            // this is the case of a non map AO passed to the maps plugin
            // due to a visualization type switch in dashboard item
            // map plugin takes care of converting the AO to a suitable format
            return applyFilters(visualization, itemFilters)
        }
    }, [visualization, item, applyFilters, itemFilters])

    if (offline && visualization.mapViews?.find(mapViewIsEELayer)) {
        return (
            <NoVisualizationMessage
                message={i18n.t(
                    'Maps with Earth Engine layers cannot be displayed when offline'
                )}
            />
        )
    }

    return (
        <IframePlugin
            visualization={getVisualization()}
            item={item}
            {...pluginProps}
        />
    )
}

MapPlugin.propTypes = {
    applyFilters: PropTypes.func,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    visualization: PropTypes.object,
}

export default MapPlugin
