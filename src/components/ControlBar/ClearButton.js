import React from 'react';
import PropTypes from 'prop-types';
import IconClear from '@material-ui/icons/Clear';

import classes from './styles/ClearButton.module.css';

export const ClearButton = ({ onChange }) => {
    return (
        <button className={classes.clearbutton} onClick={onChange}>
            <IconClear
                style={{ width: '16px', height: '16px' }}
                color="action"
            />
        </button>
    );
};

ClearButton.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default ClearButton;
