import React from 'react';
import PropTypes from 'prop-types';
import ClearIcon from '../../icons/Clear';

import classes from './styles/ClearButton.module.css';

export const ClearButton = ({ onClear }) => (
    <button className={classes.button} onClick={onClear}>
        <ClearIcon className={classes.icon} color="action" />
    </button>
);

ClearButton.propTypes = {
    onClear: PropTypes.func.isRequired,
};

export default ClearButton;
