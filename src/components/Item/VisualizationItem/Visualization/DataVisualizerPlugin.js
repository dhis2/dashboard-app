import React, { Suspense, useState } from 'react'
import PropTypes from 'prop-types'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { useUserSettings } from '../../../UserSettingsProvider'
import LoadingMask from './LoadingMask'

const VisualizationPlugin = React.lazy(() =>
    import(
        /* webpackChunkName: "data-visualizer-plugin" */ /* webpackPrefetch: true */ '@dhis2/data-visualizer-plugin'
    )
)

const DataVisualizerPlugin = props => {
    const d2 = useD2()
    const { userSettings } = useUserSettings()
    const [visualizationLoaded, setVisualizationLoaded] = useState(false)

    return (
        <Suspense fallback={<div />}>
            {!visualizationLoaded && <LoadingMask style={props.style} />}
            <VisualizationPlugin
                d2={d2}
                forDashboard={true}
                userSettings={{
                    displayProperty: userSettings.keyAnalysisDisplayProperty,
                }}
                onLoadingComplete={() => setVisualizationLoaded(true)}
                {...props}
            />
        </Suspense>
    )
}

DataVisualizerPlugin.propTypes = {
    style: PropTypes.object,
}

export default DataVisualizerPlugin
