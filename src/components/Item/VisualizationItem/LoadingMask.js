import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import classes from './styles/LoadingMask.module.css';

function CircularIndeterminate() {
    return (
        <div className={classes.outer}>
            <CircularProgress className={classes.progress} />
        </div>
    );
}

export default CircularIndeterminate;
