import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { MAP } from '../../../../modules/itemTypes'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId'
import { isElementFullscreen } from '../isElementFullscreen'
import DefaultPlugin from './DefaultPlugin'
import NoVisualizationMessage from './NoVisualizationMessage'
import { pluginIsAvailable, getPlugin, unmount } from './plugin'

const mapViewIsEELayer = mapView => mapView.layer.includes('earthEngine')

const MapPlugin = ({
    visualization,
    applyFilters,
    availableHeight,
    availableWidth,
    gridWidth,
    itemFilters,
    ...props
}) => {
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        const resizeMap = async (id, isFullscreen) => {
            const plugin = await getPlugin(MAP)
            plugin?.resize &&
                plugin.resize(getVisualizationContainerDomId(id), isFullscreen)
        }

        resizeMap(props.item.id, isElementFullscreen(props.item.id))
    }, [availableHeight, availableWidth, gridWidth])

    // The function returned from this effect is run when this component unmounts
    useEffect(() => () => unmount(props.item, MAP), [])

    useEffect(() => {
        const setMapOfflineStatus = async offlineStatus => {
            const plugin = await getPlugin(MAP)
            plugin?.setOfflineStatus && plugin.setOfflineStatus(offlineStatus)
        }

        !offline && setInitialized(true)

        setMapOfflineStatus(offline)
    }, [offline])

    if (
        offline &&
        !initialized &&
        visualization.mapViews?.find(mapViewIsEELayer)
    ) {
        return (
            <NoVisualizationMessage
                message={i18n.t(
                    'Maps with Earth Engine layers cannot be displayed when offline'
                )}
            />
        )
    }

    const vis = applyFilters(visualization, itemFilters)

    return pluginIsAvailable(MAP) ? (
        <>
            <DefaultPlugin
                options={{
                    hideTitle: true,
                }}
                {...props}
                visualization={vis}
                mapViewCount={vis.mapViews?.length}
            />
        </>
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
