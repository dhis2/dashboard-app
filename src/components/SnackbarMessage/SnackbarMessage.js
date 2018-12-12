import React from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';

import { sGetSnackbar } from '../../reducers/snackbar';
import { acCloseSnackbar } from '../../actions/snackbar';

const LOADING_DASHBOARD = 'LOADING_DASHBOARD';
export const loadingDashboardMsg = { name: '', type: LOADING_DASHBOARD };

const SnackbarMessageContent = ({ message }) => {
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

export const SnackbarMessage = props => {
    return (
        <Snackbar
            open={props.snackbarOpen}
            message={<SnackbarMessageContent message={props.snackbarMessage} />}
            autoHideDuration={props.snackbarDuration}
            onRequestClose={props.onCloseSnackbar}
        />
    );
};

const mapStateToProps = state => {
    const { message, duration, open } = sGetSnackbar(state);
    return {
        snackbarOpen: open,
        snackbarMessage: message,
        snackbarDuration: duration,
    };
};

export default connect(
    mapStateToProps,
    {
        onCloseSnackbar: acCloseSnackbar,
    }
)(SnackbarMessage);
