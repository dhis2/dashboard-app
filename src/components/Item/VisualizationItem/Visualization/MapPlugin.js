import { useOnlineStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import IframePlugin from './IframePlugin.js'
import NoVisualizationMessage from './NoVisualizationMessage.js'

const mapViewIsEELayer = (mapView) => mapView.layer.includes('earthEngine')

const MapPlugin = ({ visualization, style, ...pluginProps }) => {
    const { offline } = useOnlineStatus()

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
            visualization={visualization}
            style={style}
            {...pluginProps}
        />
    )
}

MapPlugin.propTypes = {
    style: PropTypes.object,
    visualization: PropTypes.object,
}

export default MapPlugin
