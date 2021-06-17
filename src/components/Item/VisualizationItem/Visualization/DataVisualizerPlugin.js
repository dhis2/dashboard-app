import React, { Suspense, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useUserSettings } from '../../../UserSettingsProvider'
import LoadingMask from './LoadingMask'
import VisualizationErrorMessage from './VisualizationErrorMessage'

const VisualizationPlugin = React.lazy(() =>
    import(
        /* webpackChunkName: "data-visualizer-plugin" */ /* webpackPrefetch: true */ '@dhis2/data-visualizer-plugin'
    )
)

const DataVisualizerPlugin = ({
    filterVersion,
    item,
    style,
    visualization,
}) => {
    const { userSettings } = useUserSettings()
    const [visualizationLoaded, setVisualizationLoaded] = useState(false)
    const [error, setError] = useState(false)

    const onLoadingComplete = useCallback(
        () => setVisualizationLoaded(true),
        []
    )

    const onError = () => setError(true)

    useEffect(() => {
        setError(false)
    }, [filterVersion])

    if (error) {
        return <VisualizationErrorMessage item={item} />
    }

    return (
        <Suspense fallback={<div />}>
            {!visualizationLoaded && <LoadingMask style={style} />}
            <VisualizationPlugin
                visualization={visualization}
                forDashboard={true}
                userSettings={userSettings}
                style={style}
                onLoadingComplete={onLoadingComplete}
                onError={onError}
            />
        </Suspense>
    )
}

DataVisualizerPlugin.propTypes = {
    filterVersion: PropTypes.string,
    item: PropTypes.object,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

export default DataVisualizerPlugin
