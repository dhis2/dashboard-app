import React from 'react';
import { CircularLoader } from '@dhis2/ui-core';

import classes from './styles/LoadingMask.module.css';

const LoadingMask = () => {
    return (
        <div className={classes.vertical}>
            <div className={classes.horizontal}>
                <CircularLoader />
            </div>
        </div>
    );
};

export default LoadingMask;
