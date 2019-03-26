/* global DHIS_CONFIG, manifest */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';
import { config, getUserSettings } from 'd2/lib/d2';

import App from './App';
import i18n from './locales';
import configureStore from './configureStore';
import { muiTheme } from './theme';

import './reset-text.css';
import './index.css';

const configI18n = userSettings => {
    const uiLocale = userSettings.keyUiLocale;

    if (uiLocale && uiLocale !== 'en') {
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }

    config.i18n.sources.add('./i18n/i18n_module_en.properties');
    i18n.changeLanguage(uiLocale);
};

const init = () => {
    // init material-ui

    // log app info
    console.info(
        `Dashboards app, v${manifest.version}, ${
            manifest.manifest_generated_at
        }`
    );

    // api config
    const isProd = process.env.NODE_ENV === 'production';
    const baseUrl = isProd
        ? manifest.activities.dhis.href
        : DHIS_CONFIG.baseUrl;
    config.baseUrl = `${baseUrl}/api/${manifest.dhis2.apiVersion}`;
    config.headers = isProd
        ? null
        : { Authorization: DHIS_CONFIG.authorization };

    getUserSettings()
        .then(configI18n)
        .then(() => {
            config.schemas = [
                'chart',
                'map',
                'report',
                'reportTable',
                'eventChart',
                'eventReport',
                'dashboard',
                'organisationUnit',
                'userGroup',
            ];

            ReactDOM.render(
                <D2UIApp initConfig={config} muiTheme={muiTheme()}>
                    <Provider store={configureStore()}>
                        <App baseUrl={baseUrl} />
                    </Provider>
                </D2UIApp>,
                document.getElementById('root')
            );
        });
};

init();
