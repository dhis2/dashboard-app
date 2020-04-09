import React from 'react';
import { ComponentCover, CircularLoader } from '@dhis2/ui-core';

function LoadingMask() {
    return (
        <ComponentCover>
            <CircularLoader />
        </ComponentCover>
    );
}

export default LoadingMask;
