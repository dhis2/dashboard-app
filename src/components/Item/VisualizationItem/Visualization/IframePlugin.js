//import { useCachedDataQuery } from '@dhis2/analytics'
import postRobot from '@krakenjs/post-robot'
import PropTypes from 'prop-types'
import React, { Suspense, useRef, useCallback, useState, useEffect } from 'react'
//import { itemTypeMap } from '../../../../modules/itemTypes.js'
import { getPluginOverrides } from '../../../../modules/localStorage.js'
import { useUserSettings } from '../../../UserSettingsProvider.js'
import classes from './styles/DataVisualizerPlugin.module.css'
import VisualizationErrorMessage from './VisualizationErrorMessage.js'

const IframePlugin = ({
    filterVersion,
    item,
    style,
    visualization,
    dashboardMode,
}) => {
    const { userSettings } = useUserSettings()
    //const { apps } = useCachedDataQuery()
    const iframeRef = useRef()
    const [error, setError] = useState(false)

    const onError = () => setError(true)

    useEffect(() => {
        const listener = postRobot.on(
            'getProps',
            // listen for messages coming only from the iframe rendered by this component
            { window: iframeRef.current.contentWindow },
            () => ({
                isVisualizationLoaded: true,
                nameProp: userSettings.displayProperty,
                visualization,
                onError,
            })
        )

        return () => listener.cancel()
    }, [visualization, userSettings.displayProperty])

    useEffect(() => {
        setError(false)
    }, [filterVersion, visualization.type])

    const getIframeSrc = useCallback(() => {
        const pluginOverrides = getPluginOverrides()

        if (pluginOverrides && pluginOverrides[item.type]) {
            return pluginOverrides[item.type]
        }
/*
        const appKey = itemTypeMap[item.type].appKey

        if (appKey) {
            const appDetails = apps.find((app) => app.key === appKey)

            return appDetails?.pluginLaunchUrl
        }
*/
        return // XXX
    }, [item.type])

    if (error) {
        return (
            <div style={style}>
                <VisualizationErrorMessage
                    item={item}
                    dashboardMode={dashboardMode}
                />
            </div>
        )
    }

    // TODO use different URL for iframe src based on item.type
    return (
        <div className={classes.wrapper}>
            <iframe
                ref={iframeRef}
                src={getIframeSrc()}
                style={{ width: '100%', height: '100%', border: 'none' }}
            ></iframe>
        </div>
    )
}

IframePlugin.propTypes = {
    dashboardMode: PropTypes.string,
    filterVersion: PropTypes.string,
    item: PropTypes.object,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

export default IframePlugin
