import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
    MuiThemeProvider,
    createMuiTheme,
    createGenerateClassName,
    jssPreset,
} from '@material-ui/core/styles';
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { init as d2Init, config, getManifest, getUserSettings } from 'd2';
import dhis2theme from '@dhis2/d2-ui-core/theme/mui3.theme';

// temporary workaround until new ui headerbar is ready
import 'material-design-icons/iconfont/material-icons.css';
import './reset.css';

import App from './components/App';
import './index.css';
import i18n from './locales';
import configureStore from './configureStore';
import { muiTheme } from './modules/theme';

const generateClassName = createGenerateClassName();
const jss = create({
    ...jssPreset(),
    insertionPoint: document.getElementById('jss-insertion-point'),
});

const v1Theme = () => createMuiTheme({ ...dhis2theme });

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
                <JssProvider jss={jss} generateClassName={generateClassName}>
                    <Provider store={configureStore()}>
                        <MuiThemeProvider theme={v1Theme()}>
                            <V0MuiThemeProvider muiTheme={muiTheme()}>
                                <App baseUrl={baseUrl} d2={initializedD2} />
                            </V0MuiThemeProvider>
                        </MuiThemeProvider>
                    </Provider>
                </JssProvider>,
                document.getElementById('root')
            );
        });
};

init();
