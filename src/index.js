/* global DHIS_CONFIG */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';

import { getManifest } from 'd2/lib/d2';

import './index.css';

import configureStore from './configureStore';

import App from './App';

// init material-ui
injectTapEventPlugin();

// init d2
getManifest('manifest.webapp').then(manifest => {
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? manifest.getBaseUrl()
            : DHIS_CONFIG.baseUrl;

    const headers =
        process.env.NODE_ENV !== 'production' && DHIS_CONFIG.authorization
            ? { Authorization: DHIS_CONFIG.authorization }
            : null;

    ReactDOM.render(
        <D2UIApp
            initConfig={{
                baseUrl: `${baseUrl}/api`,
                headers,
                schemas: [
                    'dashboard',
                    'chart',
                    'reportTable',
                    'map',
                    'eventReport',
                    'eventChart',
                ],
            }}
        >
            <Provider store={configureStore()}>
                <App baseUrl={baseUrl} />
            </Provider>
        </D2UIApp>,
        document.getElementById('root')
    );
});
