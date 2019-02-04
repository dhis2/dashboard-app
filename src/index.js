/* global DHIS_CONFIG, manifest */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';
import { init as d2Init, config, getUserSettings } from 'd2';
import dhis2theme from '@dhis2/d2-ui-core/theme/mui3.theme';

// temporary workaround until new ui headerbar is ready
import 'material-design-icons/iconfont/material-icons.css';
import './reset.css';

import App from './components/App';
import './index.css';
import i18n from './locales';
import configureStore from './configureStore';
import { muiTheme } from './modules/theme';

const v1Theme = () => createMuiTheme({ ...dhis2theme });

const configI18n = userSettings => {
    const uiLocale = userSettings.keyUiLocale;

    if (uiLocale && uiLocale !== 'en') {
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }

    config.i18n.sources.add('./i18n/i18n_module_en.properties');
    i18n.changeLanguage(uiLocale);
};

const init = () => {
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
    config.schemas = ['dashboard', 'organisationUnit', 'chart'];
    config.headers = isProd
        ? null
        : { Authorization: DHIS_CONFIG.authorization };

    getUserSettings()
        .then(configI18n)
        .then(() => d2Init(config))
        .then(initializedD2 => {
            ReactDOM.render(
                <Provider store={configureStore()}>
                    <MuiThemeProvider theme={v1Theme()}>
                        <V0MuiThemeProvider muiTheme={muiTheme()}>
                            <App baseUrl={baseUrl} d2={initializedD2} />
                        </V0MuiThemeProvider>
                    </MuiThemeProvider>
                </Provider>,
                document.getElementById('root')
            );
        });
};

init();
