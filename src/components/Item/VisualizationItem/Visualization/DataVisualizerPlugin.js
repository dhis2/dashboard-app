import React, { Suspense, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useUserSettings } from '../../../UserSettingsProvider'
import LoadingMask from './LoadingMask'

const VisualizationPlugin = React.lazy(() =>
    import(
        /* webpackChunkName: "data-visualizer-plugin" */ /* webpackPrefetch: true */ '@dhis2/data-visualizer-plugin'
    )
)

const DataVisualizerPlugin = props => {
    const { userSettings } = useUserSettings()
    const [visualizationLoaded, setVisualizationLoaded] = useState(false)

    const onLoadingComplete = useCallback(
        () => setVisualizationLoaded(true),
        []
    )

    return (
        <Suspense fallback={<div />}>
            {!visualizationLoaded && <LoadingMask style={props.style} />}
            <VisualizationPlugin
                forDashboard={true}
                userSettings={userSettings}
                onLoadingComplete={onLoadingComplete}
                {...props}
            />
        </Suspense>
    )
}

DataVisualizerPlugin.propTypes = {
    style: PropTypes.object,
}

export default DataVisualizerPlugin
