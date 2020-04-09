import React from 'react';
import { CircularLoader } from '@dhis2/ui-core';

import classes from './styles/LoadingMask.module.css';

function LoadingMask() {
    return (
        <div className={classes.mask}>
            <CircularLoader />
        </div>
    );
}

export default LoadingMask;
