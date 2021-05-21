import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { useOnlineStatus } from '../../../../modules/useOnlineStatus'
import DefaultPlugin from './DefaultPlugin'
import { MAP } from '../../../../modules/itemTypes'
import { isElementFullscreen } from '../isElementFullscreen'
import { pluginIsAvailable, getPlugin } from './plugin'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId'
import NoVisualizationMessage from './NoVisualizationMessage'

const MapPlugin = ({
    applyFilters,
    availableHeight,
    availableWidth,
    gridWidth,
    ...props
}) => {
    const { isOnline } = useOnlineStatus()

    useEffect(() => {
        const resizeMap = async (id, isFullscreen) => {
            const plugin = await getPlugin(MAP)
            plugin?.resize &&
                plugin.resize(getVisualizationContainerDomId(id), isFullscreen)
        }

        resizeMap(props.item.id, isElementFullscreen(props.item.id))
    }, [availableHeight, availableWidth, gridWidth])

    useEffect(() => {
        const setMapOfflineStatus = async isOnline => {
            const plugin = await getPlugin(MAP)
            plugin?.setOfflineStatus && plugin.setOfflineStatus(isOnline)
        }

        setMapOfflineStatus(!isOnline)
    }, [isOnline])

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

    return pluginIsAvailable(MAP) ? (
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
    applyFilters: PropTypes.func,
    availableHeight: PropTypes.number,
    availableWidth: PropTypes.number,
    gridWidth: PropTypes.number,
    isFullscreen: PropTypes.bool,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    visualization: PropTypes.object,
}

export default MapPlugin
