import { Layer, CenteredContent, CircularLoader } from '@dhis2/ui'
import React from 'react'

const LoadingMask = () => (
    <Layer translucent>
        <CenteredContent>
            <CircularLoader />
        </CenteredContent>
    </Layer>
)

export default LoadingMask
