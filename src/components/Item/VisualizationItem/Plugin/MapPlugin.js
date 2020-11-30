import React from 'react'
import PropTypes from 'prop-types'
import DefaultPlugin from './DefaultPlugin'
import { MAP } from '../../../../modules/itemTypes'

const MapPlugin = ({ getFilteredVisualization, ...props }) => {
    if (props.item.type === MAP) {
        // apply filters only to thematic and event layers
        // for maps AO
        const mapViews = props.visualization.mapViews.map(mapView => {
            if (
                mapView.layer.includes('thematic') ||
                mapView.layer.includes('event')
            ) {
                return getFilteredVisualization(mapView, props.itemFilters)
            }

            return mapView
        })

        props.visualization = {
            ...props.visualization,
            mapViews,
        }
    } else {
        // this is the case of a non map AO passed to the maps plugin
        // due to a visualization type switch in dashboard item
        // maps plugin takes care of converting the AO to a suitable format
        props.visualization = getFilteredVisualization(
            props.visualization,
            props.itemFilters
        )
    }

    return (
        <DefaultPlugin
            options={{
                hideTitle: true,
            }}
            {...props}
        />
    )
}

MapPlugin.propTypes = {
    getFilteredVisualization: PropTypes.func,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    visualization: PropTypes.object,
}

export default MapPlugin
