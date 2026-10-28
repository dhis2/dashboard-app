import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { getAppName } from '../../../../modules/itemTypes.js'
import { useCurrentUser } from '../../../AppDataProvider/AppDataProvider.jsx'
import MissingAuthorityMessage from '../../ItemMessage/MissingAuthorityMessage.jsx'
import VisualizationErrorMessage from '../../ItemMessage/VisualizationErrorMessage.jsx'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId.js'
import { hasPluginAccess, load, unmount } from './plugin.js'

const LegacyPlugin = ({
    item,
    activeType,
    dashboardMode,
    visualization,
    style,
    gridWidth,
}) => {
    const { baseUrl } = useConfig()
    const { authorities } = useCurrentUser()
    const [loadFailed, setLoadFailed] = useState(false)
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
            setLoadFailed(false)
            load(item, visualization, {
                credentials: { baseUrl },
                activeType,
            }).catch(() => setLoadFailed(true))
        }

        prevItem.current = item
        prevActiveType.current = activeType
        prevVisualization.current = visualization

        return () => {
            // the plugin script failed to load, so there is nothing to unmount
            unmount(item, item.type || activeType).catch(() => {})
        }
    }, [item, visualization, activeType, baseUrl])

    if (loadFailed) {
        const type = activeType || item.type

        // the plugin script is served from the app path, which requires
        // the app authority in 2.42+
        return (
            <div style={style}>
                {hasPluginAccess(type, authorities) ? (
                    <VisualizationErrorMessage
                        itemType={type}
                        visualizationId={visualization.id}
                        dashboardMode={dashboardMode}
                    />
                ) : (
                    <MissingAuthorityMessage appName={getAppName(type)} />
                )}
            </div>
        )
    }

    return <div id={getVisualizationContainerDomId(item.id)} style={style} />
}

LegacyPlugin.propTypes = {
    item: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    visualization: PropTypes.object.isRequired,
    activeType: PropTypes.string,
    dashboardMode: PropTypes.string,
    gridWidth: PropTypes.number,
}

export default LegacyPlugin
