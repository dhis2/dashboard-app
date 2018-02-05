/* global DHIS_CONFIG, manifest */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';

import { config, getUserSettings } from 'd2/lib/d2';

import './index.css';

import configureStore from './configureStore';

import App from './App';

// init material-ui
injectTapEventPlugin();

let baseUrl;

const configI18n = userSettings => {
    const uiLocale = userSettings.keyUiLocale;

    if (uiLocale && uiLocale !== 'en') {
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }

    config.i18n.sources.add('./i18n/i18n_module_en.properties');
};

const isProd = process.env.NODE_ENV === 'production';
baseUrl = isProd ? manifest.getBaseUrl() : DHIS_CONFIG.baseUrl;
config.baseUrl = `${baseUrl}/api/${manifest.version}`;
config.headers = isProd ? null : { Authorization: DHIS_CONFIG.authorization };

getUserSettings()
    .then(configI18n)
    .then(() => {
        config.schemas = ['dashboard'];

        ReactDOM.render(
            <D2UIApp initConfig={config}>
                <Provider store={configureStore()}>
                    <App baseUrl={baseUrl} />
                </Provider>
            </D2UIApp>,
            document.getElementById('root')
        );
    });
