import React, { Suspense } from 'react'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'

const VisualizationPlugin = React.lazy(() =>
    import(
        /* webpackChunkName: "data-visualizer-plugin" */ /* webpackPrefetch: true */ '@dhis2/data-visualizer-plugin'
    )
)

export const DataVisualizerPlugin = props => {
    const d2 = useD2({})
    return (
        <Suspense fallback={<div />}>
            <VisualizationPlugin d2={d2} {...props} />
        </Suspense>
    )
}
