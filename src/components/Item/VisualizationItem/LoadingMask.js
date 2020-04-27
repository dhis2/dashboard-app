import React from 'react';
import { CircularLoader } from '@dhis2/ui-core';

import classes from './styles/LoadingMask.module.css';

const LoadingMask = () => {
    return (
        <div className={classes.center}>
            <CircularLoader />
        </div>
    );
};

export default LoadingMask;
