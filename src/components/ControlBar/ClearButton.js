import React from 'react';
import PropTypes from 'prop-types';
import ClearIcon from '../../icons/Clear';

import classes from './styles/ClearButton.module.css';

export const ClearButton = ({ onChange }) => (
    <button className={classes.button} onClick={onChange}>
        <ClearIcon className={classes.icon} color="action" />
    </button>
);

ClearButton.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default ClearButton;
