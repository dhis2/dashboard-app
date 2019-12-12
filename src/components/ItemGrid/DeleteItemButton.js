import React from 'react';
import PropTypes from 'prop-types';
import ItemHeaderButton from '../Item/ItemHeaderButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { colors } from '@dhis2/ui-core';

const style = {
    button: {
        position: 'absolute',
        top: '7px',
        right: '7px',
        zIndex: '1000',
    },
    icon: {
        fill: colors.red500,
    },
};

const DeleteItemHeaderButton = ({ onClick }) => (
    <ItemHeaderButton onClick={onClick} style={style.button}>
        <DeleteIcon style={style.icon} />
    </ItemHeaderButton>
);

DeleteItemHeaderButton.propTypes = {
    onClick: PropTypes.func,
};

export default DeleteItemHeaderButton;
