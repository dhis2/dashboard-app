import React from 'react';
import ItemHeaderButton from '../Item/ItemHeaderButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { colors } from '../../modules/colors';

const style = {
    button: {
        position: 'absolute',
        top: '7px',
        right: '7px',
        zIndex: '1000',
    },
    icon: {
        fill: colors.red,
    },
};

const DeleteItemHeaderButton = ({ onClick }) => (
    <ItemHeaderButton onClick={onClick} style={style.button}>
        <DeleteIcon style={style.icon} />
    </ItemHeaderButton>
);

export default DeleteItemHeaderButton;
