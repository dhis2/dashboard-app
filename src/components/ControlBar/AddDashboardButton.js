import React from 'react';
import AddIcon from '@material-ui/icons/AddCircle';
import styles from './styles/AddDashboardButton.module.css';

const AddDashboardButton = () => (
    <React.Fragment>
        <button className={styles.button}>
            <AddIcon className={styles.icon} />
        </button>
    </React.Fragment>
);

export default AddDashboardButton;
