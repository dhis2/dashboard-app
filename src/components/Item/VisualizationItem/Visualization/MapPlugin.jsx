import i18n from '@dhis2/d2-i18n'
import { Cover, IconInfo24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import IframePlugin from './IframePlugin.jsx'
import classes from './styles/Visualization.module.css'

const mapHasEELayer = (visualization) =>
    visualization.mapViews?.find((mv) => mv.layer.includes('earthEngine'))

/* Earth Engine layers need a live connection, so an offline map that has one
 * shows a notice instead of the plugin. */
const MapPlugin = ({ offline, visualization, iFramePluginProps, style }) =>
    offline && mapHasEELayer(visualization) ? (
        <div style={style}>
            <Cover>
                <div className={classes.messageContent}>
                    <IconInfo24 color={colors.grey500} />
                    <span>
                        {i18n.t(
                            'Maps with Earth Engine layers cannot be displayed when offline'
                        )}
                    </span>
                </div>
            </Cover>
        </div>
    ) : (
        <IframePlugin visualization={visualization} {...iFramePluginProps} />
    )

MapPlugin.propTypes = {
    iFramePluginProps: PropTypes.object,
    offline: PropTypes.bool,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

export default MapPlugin
