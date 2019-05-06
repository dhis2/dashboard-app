import React from 'react';
import AddIcon from '@material-ui/icons/AddCircle';
import styles from './styles/AddDashboardButton.module.css';

const AddDashboardButton = () => (
    <button className={styles.button}>
        <AddIcon className={styles.icon} />
    </button>
);

export default AddDashboardButton;
