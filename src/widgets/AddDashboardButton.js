import React from 'react';
import AddIcon from '@material-ui/icons/AddCircle';
import { colors } from '../modules/colors';
import { NONAME } from 'dns';

const styles = {
    button: {
        width: 36,
        height: 36,
        padding: 0,
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        // cursor: 'pointer',
    },
    icon: {
        fill: colors.mediumGreen,
        // color: colors.mediumGreen,
        width: '1.3em',
        height: '1.3em',
        // cursor: 'pointer',
    },
};

const AddButton = () => {
    return (
        <button style={styles.button}>
            <AddIcon style={styles.icon} />
        </button>
    );
};

export default AddButton;
