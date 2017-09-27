import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { init, getManifest } from 'd2/lib/d2';

import './index.css';

import configureStore from './configureStore';

import App from './App';

const indexRender = (props) => {
    ReactDOM.render(
        <MuiThemeProvider>
            <Provider store={configureStore()}>
                <App {...props} />
            </Provider>
        </MuiThemeProvider>,
        document.getElementById('root'),
    );
};

// init material-ui
injectTapEventPlugin();

// init d2
getManifest('manifest.webapp').then((manifest) => {
    const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : 'http://localhost:8080';

    init({
        baseUrl: `${baseUrl}/api`,
        headers: {
            Authorization: `Basic ${btoa('admin:district')}`,
        },
        schemas: ['dashboard'],
    }).then((d2) => {
        indexRender({ d2 });
    });
});
