import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import IconClear from '@material-ui/icons/Clear';

const styles = {
    clearButton: {
        width: '20px',
        height: '20px',
        padding: '2px',
    },
    clearButtonIcon: {
        width: '16px',
        height: '16px',
    },
};

export const ClearButton = ({ name, onChangeName, classes }) => {
    const disabled = name === null || name === '';

    return (
        <IconButton
            className={classes.clearButton}
            style={{ opacity: disabled ? 0 : 1 }}
            onClick={() => onChangeName()}
            disabled={disabled}
        >
            <IconClear className={classes.clearButtonIcon} color="action" />
        </IconButton>
    );
};

ClearButton.propTypes = {
    name: PropTypes.string.isRequired,
    onChangeName: PropTypes.func.isRequired,
};

export default withStyles(styles)(ClearButton);
