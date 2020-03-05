import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    progress: {
        margin: theme.spacing.unit * 2,
        maxWidth: 200,
        textAlign: 'center',
        alignSelf: 'center',
    },
    outer: {
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
    },
});

function CircularIndeterminate(props) {
    const { classes } = props;
    return (
        <div className={classes.outer}>
            <CircularProgress className={classes.progress} />
        </div>
    );
}

CircularIndeterminate.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularIndeterminate);
