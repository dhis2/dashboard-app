import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { useConfig } from '@dhis2/app-runtime'
import { load, unmount } from './plugin'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId'

const DefaultPlugin = ({ item, activeType, visualization, options, style }) => {
    const { d2 } = useD2()
    const { baseUrl } = useConfig()
    const credentials = {
        baseUrl,
        auth: d2.Api.getApi().defaultHeaders.Authorization,
    }

    const prevItem = useRef()
    const prevActiveType = useRef()

    useEffect(() => {
        load(item, visualization, {
            credentials,
            activeType,
            options,
        })

        prevItem.current = item
        prevActiveType.current = activeType

        return () => unmount(item, activeType)
    }, [])

    useEffect(() => {
        if (shouldPluginReload()) {
            unmount(item, prevActiveType.current)
            load(item, visualization, {
                credentials,
                activeType,
            })
        }

        prevItem.current = item
        prevActiveType.current = activeType
    }, [item, visualization, activeType])

    /**
     * Prevent unnecessary re-rendering
     * TODO: fix this hack
     */
    const shouldPluginReload = () => {
        const reloadAllowed = prevItem.current === item
        const visChanged = prevActiveType.current !== activeType

        return reloadAllowed && visChanged
    }

    return <div id={getVisualizationContainerDomId(item.id)} style={style} />
}

DefaultPlugin.propTypes = {
    activeType: PropTypes.string,
    item: PropTypes.object,
    options: PropTypes.object,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

DefaultPlugin.defaultProps = {
    style: {},
    isRecording: false,
    item: {},
    options: {},
    visualization: {},
}

export default DefaultPlugin
