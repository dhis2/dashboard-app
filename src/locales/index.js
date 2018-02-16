import i18n from 'i18next';
import en from './en';
import ur from './ur';

const langs = {
    en,
    ur,
};

const resources = {};

Object.entries(langs).forEach(([code, translations]) => {
    resources[code] = {
        dhis2: translations,
    };
});

i18n.init({
    resources,

    lng: 'en',
    fallbackLng: 'en',

    debug: false,
    ns: ['dhis2'],
    defaultNS: 'dhis2',

    keySeparator: false,
    react: {
        wait: true,
    },
});

export default i18n;
