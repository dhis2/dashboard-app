import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { init as d2Init, config, getManifest, getUserSettings } from 'd2';
import dhis2theme from '@dhis2/d2-ui-core/theme/mui3.theme';
import { colors } from '@dhis2/ui-core';

import { Provider as RuntimeProvider } from '@dhis2/app-runtime';
import { CssReset } from '@dhis2/ui-core';

import App from './components/App';
import './index.css';
import i18n from './locales';
import configureStore from './configureStore';

// small workaround until ui-core textarea is ready
dhis2theme.palette.primary.dark = colors.teal600;

const muiTheme = () => createMuiTheme(dhis2theme);

const configI18n = userSettings => {
    const uiLocale = userSettings.keyUiLocale;

    if (uiLocale && uiLocale !== 'en') {
        config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }

    config.i18n.sources.add('./i18n/i18n_module_en.properties');
    i18n.changeLanguage(uiLocale);
};

const init = async () => {
    const manifest = await getManifest('./manifest.webapp');

    // log app info
    console.info(
        `Dashboards app, v${manifest.version}, ${
            manifest.manifest_generated_at
        }`
    );

    const isProd = process.env.NODE_ENV === 'production';

    if (
        !isProd &&
        (!process.env.REACT_APP_DHIS2_BASE_URL ||
            !process.env.REACT_APP_DHIS2_AUTHORIZATION)
    ) {
        throw new Error(
            'Missing env variables REACT_APP_DHIS2_BASE_URL and REACT_APP_DHIS2_AUTHORIZATION'
        );
    }

    // api config
    const baseUrl = isProd
        ? manifest.activities.dhis.href
        : process.env.REACT_APP_DHIS2_BASE_URL;
    const authorization = process.env.REACT_APP_DHIS2_AUTHORIZATION;

    config.baseUrl = `${baseUrl}/api/${manifest.dhis2.apiVersion}`;
    config.headers = isProd ? null : { Authorization: authorization };
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

    getUserSettings()
        .then(configI18n)
        .then(() => d2Init(config))
        .then(initializedD2 => {
            ReactDOM.render(
                <RuntimeProvider config={{
                    baseUrl: baseUrl,
                    apiVersion: manifest.dhis2.apiVersion,
                }}>
                    <CssReset />
                    <Provider store={configureStore()}>
                        <MuiThemeProvider theme={muiTheme()}>
                            <App baseUrl={baseUrl} d2={initializedD2} />
                        </MuiThemeProvider>
                    </Provider>
                </RuntimeProvider>,
                document.getElementById('root')
            );
        });
};

init();
