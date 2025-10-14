import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId.js'
import { load, unmount } from './plugin.js'

const LegacyPlugin = ({
    item,
    activeType,
    visualization,
    style,
    gridWidth,
}) => {
    const { baseUrl } = useConfig()
    const prevItem = useRef()
    const prevActiveType = useRef()
    const prevVisualization = useRef()

    useEffect(() => {
        const el = document.querySelector(
            `#${getVisualizationContainerDomId(item.id)}`
        )
        if (typeof el?.setViewportSize === 'function') {
            setTimeout(
                () =>
                    el.setViewportSize(el.clientWidth - 5, el.clientHeight - 5),
                10
            )
        }
    }, [style.width, style.height, gridWidth, item.id])

    useEffect(() => {
        if (
            !prevItem.current ||
            (prevItem.current === item &&
                prevActiveType.current !== activeType) ||
            prevVisualization.current !== visualization
        ) {
            // Initial load, or active type or filter has changed
            load(item, visualization, {
                credentials: { baseUrl },
                activeType,
            })
        }

        prevItem.current = item
        prevActiveType.current = activeType
        prevVisualization.current = visualization

        return () => unmount(item, item.type || activeType)
    }, [item, visualization, activeType, baseUrl])

    return <div id={getVisualizationContainerDomId(item.id)} style={style} />
}

LegacyPlugin.propTypes = {
    item: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    visualization: PropTypes.object.isRequired,
    activeType: PropTypes.string,
    gridWidth: PropTypes.number,
}

export default LegacyPlugin
