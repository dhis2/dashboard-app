import React from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import DeleteIcon from '@material-ui/icons/Delete';
import { colors } from '@dhis2/ui';

import classes from './styles/DeleteItemButton.module.css';

const DeleteItemButton = ({ onClick }) => (
    <button
        type="button"
        className={classes.deleteItemButton}
        onClick={onClick}
        title={i18n.t(`Delete item`)}
    >
        <DeleteIcon style={{ fill: colors.red500 }} />
    </button>
);

DeleteItemButton.propTypes = {
    onClick: PropTypes.func,
};

export default DeleteItemButton;
