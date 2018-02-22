import React from 'react';

const LOADING_DASHBOARD = 'LOADING_DASHBOARD';
export const loadingDashboardMsg = { name: '', type: LOADING_DASHBOARD };

const SnackbarMessage = ({ message }) => {
    if (typeof message === 'object') {
        //future message types:  switch(message.type)
        return (
            <span>
                Loading <span style={{ fontWeight: 800 }}>{message.name}</span>{' '}
                dashboard
            </span>
        );
    }
    return message;
};

export default SnackbarMessage;
