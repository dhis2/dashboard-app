import React from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import { colors } from '@dhis2/ui-core';

import classes from './styles/DeleteItemButton.module.css';

const DeleteItemButton = ({ onClick }) => (
    <button
        type="button"
        className={classes.deleteItemButton}
        onClick={onClick}
    >
        <DeleteIcon style={{ fill: colors.red500 }} />
    </button>
);

DeleteItemButton.propTypes = {
    onClick: PropTypes.func,
};

export default DeleteItemButton;
