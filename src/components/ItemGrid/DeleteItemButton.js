import React from 'react';
import ItemHeaderButton from '../Item/ItemHeaderButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { colors } from '@material-ui/core';

const containerStyle = {
    position: 'absolute',
    top: '7px',
    right: '7px',
    zIndex: '1000',
};

const DeleteItemHeaderButton = ({ classes, onClick }) => (
    <ItemHeaderButton onClick={onClick} style={containerStyle}>
        <DeleteIcon style={{ fill: colors.red }} />
    </ItemHeaderButton>
);

export default DeleteItemHeaderButton;
