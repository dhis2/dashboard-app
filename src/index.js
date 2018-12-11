/* global DHIS_CONFIG, manifest */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';
import { init as d2Init, config, getUserSettings } from 'd2';

import App from './App';
import './index.css';
import i18n from './locales';
import configureStore from './configureStore';
import { muiTheme } from './theme';

const configI18n = userSettings => {
    const uiLocale = userSettings.keyUiLocale;

    if (uiLocale && uiLocale !== 'en') {
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }

    config.i18n.sources.add('./i18n/i18n_module_en.properties');
    i18n.changeLanguage(uiLocale);
};

const init = async () => {
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

    const d2 = await d2Init({
        baseUrl: config.baseUrl,
    });

    getUserSettings()
        .then(configI18n)
        .then(() => {
            config.schemas = ['dashboard', 'organisationUnit'];

            ReactDOM.render(
                <Provider store={configureStore()}>
                    <V0MuiThemeProvider muiTheme={muiTheme()}>
                        <App baseUrl={baseUrl} d2={d2} />
                    </V0MuiThemeProvider>
                </Provider>,
                document.getElementById('root')
            );
        });
};

init();
