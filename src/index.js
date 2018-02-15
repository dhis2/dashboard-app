/* global DHIS_CONFIG, manifest */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import i18n from './locales';
import { I18nextProvider } from 'react-i18next';

import injectTapEventPlugin from 'react-tap-event-plugin';
import D2UIApp from 'd2-ui/lib/app/D2UIApp';

import { config, getUserSettings } from 'd2/lib/d2';

import './index.css';

import configureStore from './configureStore';

import App from './App';

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
    injectTapEventPlugin();

    // log app info
    console.info(
        `Dashboards app, v${manifest.version}, ${
            manifest.manifest_generated_at
        }`
    );

    // d2-ui config
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
            config.schemas = ['dashboard'];

            ReactDOM.render(
                <I18nextProvider i18n={i18n}>
                    <D2UIApp initConfig={config}>
                        <Provider store={configureStore()}>
                            <App baseUrl={baseUrl} />
                        </Provider>
                    </D2UIApp>
                </I18nextProvider>,
                document.getElementById('root')
            );
        });
};

init();
