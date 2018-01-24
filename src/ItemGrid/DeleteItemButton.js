import React from 'react';
import ItemHeaderButton from '../Item/ItemHeaderButton';
import { colors } from '../colors';

const style = {
    position: 'absolute',
    top: '7px',
    right: '7px',
    zIndex: '1000',
    fill: colors.red,
};

const DeleteItemHeaderButton = ({ onClick }) => (
    <ItemHeaderButton style={style} onClick={onClick} icon={'Delete'} />
);

export default DeleteItemHeaderButton;
