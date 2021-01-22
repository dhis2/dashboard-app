import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import DefaultPlugin from './DefaultPlugin'
import { MAP } from '../../../../modules/itemTypes'
import { pluginIsAvailable } from './plugin'
import NoVisualizationMessage from './NoVisualizationMessage'

const MapPlugin = ({ applyFilters, ...props }) => {
    if (props.item.type === MAP) {
        // apply filters only to thematic and event layers
        // for maps AO
        const mapViews = props.visualization.mapViews.map(mapView => {
            if (
                mapView.layer.includes('thematic') ||
                mapView.layer.includes('event')
            ) {
                return applyFilters(mapView, props.itemFilters)
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
        props.visualization = applyFilters(
            props.visualization,
            props.itemFilters
        )
    }

    return pluginIsAvailable(props.activeType || props.item.type) ? (
        <DefaultPlugin
            options={{
                hideTitle: true,
            }}
            {...props}
        />
    ) : (
        <NoVisualizationMessage
            message={i18n.t('Unable to load the plugin for this item')}
        />
    )
}

MapPlugin.propTypes = {
    activeType: PropTypes.string,
    applyFilters: PropTypes.func,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    visualization: PropTypes.object,
}

export default MapPlugin
