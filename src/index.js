import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import injectTapEventPlugin from 'react-tap-event-plugin';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';

import { config, getManifest, getUserSettings } from 'd2/lib/d2';

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

// init d2
getManifest('manifest.webapp')
    .then(manifest => {
        baseUrl =
            process.env.NODE_ENV === 'production'
                ? manifest.getBaseUrl()
                : 'http://localhost:8080';

        config.baseUrl = `${baseUrl}/api`;
    })
    .then(getUserSettings)
    .then(configI18n)
    .then(() => {
        config.headers = { Authorization: `Basic ${btoa('admin:district')}` };
        config.schemas = [
            'dashboard',
            'chart',
            'reportTable',
            'map',
            'eventReport',
            'eventChart',
        ];

        ReactDOM.render(
            <D2UIApp initConfig={config}>
                <Provider store={configureStore()}>
                    <App baseUrl={baseUrl} />
                </Provider>
            </D2UIApp>,
            document.getElementById('root')
        );
    });
