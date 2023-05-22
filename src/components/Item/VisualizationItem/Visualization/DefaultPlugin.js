import { useConfig } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId.js'
import { load, unmount } from './plugin.js'

const DefaultPlugin = ({
    item,
    activeType,
    filterVersion,
    mapViewCount,
    visualization,
    options,
    style,
}) => {
    const { d2 } = useD2()
    const { baseUrl } = useConfig()
    const credentials = {
        baseUrl,
        auth: d2.Api.getApi().defaultHeaders.Authorization,
    }

    const prevItem = useRef()
    const prevActiveType = useRef()
    const prevFilterVersion = useRef()
    const prevMapViewCount = useRef()
    const prevVisualization = useRef()

    useEffect(() => {
        load(item, visualization, {
            credentials,
            activeType,
            d2,
            options,
        })

        prevItem.current = item
        prevActiveType.current = activeType
        prevFilterVersion.current = filterVersion
        prevMapViewCount.current = mapViewCount
        prevVisualization.current = visualization

        return () => unmount(item, item.type || activeType)
    }, [])

    useEffect(() => {
        if (
            prevItem.current === item &&
            (prevActiveType.current !== activeType ||
                prevFilterVersion.current !== filterVersion ||
                prevMapViewCount.current < mapViewCount ||
                prevVisualization.current !== visualization)
        ) {
            /* Item is the same but type or filters has changed
             * or map was previously loaded with fewer mapViews
             * so necessary to reload
             */

            load(item, visualization, {
                credentials,
                activeType,
                d2,
                options,
            })
        }

        prevItem.current = item
        prevActiveType.current = activeType
        prevFilterVersion.current = filterVersion
        prevVisualization.current = visualization
    }, [item, visualization, activeType, filterVersion, mapViewCount])

    return <div id={getVisualizationContainerDomId(item.id)} style={style} />
}

DefaultPlugin.propTypes = {
    activeType: PropTypes.string,
    filterVersion: PropTypes.string,
    item: PropTypes.object,
    mapViewCount: PropTypes.number,
    options: PropTypes.object,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

DefaultPlugin.defaultProps = {
    style: {},
    item: {},
    options: {},
    visualization: {},
}

export default DefaultPlugin
