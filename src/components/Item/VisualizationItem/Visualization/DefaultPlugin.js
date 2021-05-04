import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { useConfig } from '@dhis2/app-runtime'
import { load, unmount } from './plugin'
import getVisualizationContainerDomId from '../getVisualizationContainerDomId'

const DefaultPlugin = ({
    item,
    activeType,
    filterVersion,
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

    useEffect(() => {
        load(item, visualization, {
            credentials,
            activeType,
            options,
        })

        prevItem.current = item
        prevActiveType.current = activeType
        prevFilterVersion.current = filterVersion

        return () => unmount(item, activeType)
    }, [])

    useEffect(() => {
        if (shouldPluginReload()) {
            load(item, visualization, {
                credentials,
                activeType,
            })
        }

        prevItem.current = item
        prevActiveType.current = activeType
        prevFilterVersion.current = filterVersion
    }, [item, visualization, activeType, filterVersion])

    /**
     * Prevent unnecessary re-rendering
     * If the item is the same but the activeType or itemFilters
     * have changed, then reload.
     * TODO: fix this hack
     */
    const shouldPluginReload = () => {
        const reloadAllowed = prevItem.current === item
        const visualizationTypeChanged = prevActiveType.current !== activeType
        const itemFiltersChanged = prevFilterVersion.current !== filterVersion

        return reloadAllowed && (visualizationTypeChanged || itemFiltersChanged)
    }

    return <div id={getVisualizationContainerDomId(item.id)} style={style} />
}

DefaultPlugin.propTypes = {
    activeType: PropTypes.string,
    filterVersion: PropTypes.string,
    item: PropTypes.object,
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
