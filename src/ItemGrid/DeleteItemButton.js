import React from 'react';
import ItemButton from '../Item/ItemButton';
import { colors } from '../colors';

const style = {
    position: 'absolute',
    top: '7px',
    right: '7px',
    zIndex: '1000',
    fill: colors.red,
};

const DeleteItemButton = ({ onClick }) => (
    <ItemButton style={style} onClick={onClick} icon={'Delete'} />
);

export default DeleteItemButton;
