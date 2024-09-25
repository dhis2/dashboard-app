import { useConfig } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId.js'
import { load, unmount } from './plugin.js'

const LegacyPlugin = ({
    item,
    activeType,
    filterVersion,
    visualization,
    options,
    style,
    gridWidth,
}) => {
    const { d2 } = useD2()
    const { baseUrl } = useConfig()
    const prevItem = useRef()
    const prevActiveType = useRef()
    const prevFilterVersion = useRef()

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
    }, [style, gridWidth, item.id])

    useEffect(() => {
        if (
            !prevItem.current ||
            (prevItem.current === item &&
                (prevActiveType.current !== activeType ||
                    prevFilterVersion.current !== filterVersion))
        ) {
            // Initial load, or active type or filter has changed
            load(item, visualization, {
                credentials: {
                    baseUrl,
                    auth: d2.Api.getApi().defaultHeaders.Authorization,
                },
                activeType,
                options,
            })
        }

        prevItem.current = item
        prevActiveType.current = activeType
        prevFilterVersion.current = filterVersion

        return () => unmount(item, item.type || activeType)
    }, [item, visualization, activeType, filterVersion, baseUrl, options, d2])

    return <div id={getVisualizationContainerDomId(item.id)} style={style} />
}

LegacyPlugin.propTypes = {
    activeType: PropTypes.string,
    filterVersion: PropTypes.string,
    gridWidth: PropTypes.number,
    item: PropTypes.object,
    options: PropTypes.object,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

LegacyPlugin.defaultProps = {
    style: {},
    item: {},
    options: {},
    visualization: {},
}

export default LegacyPlugin
