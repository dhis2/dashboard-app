import React from 'react';

const LOADING_DASHBOARD = 'LOADING_DASHBOARD';
export const loadingDashboardMsg = { name: '', type: LOADING_DASHBOARD };

const SnackbarMessage = ({ message }) => {
    // if (message.type === LOADING_DASHBOARD) {
    return (
        <span>
            Loading <span style={{ fontWeight: 800 }}>{message.name}</span>{' '}
            dashboard
        </span>
    );
    // }
};

export default SnackbarMessage;
