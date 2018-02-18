import i18n from 'dhis2-i18n';

import en from './en';
import ur from './ur';

const ns = 'dashboards-app';

i18n.addResources('en', ns, en);
i18n.addResources('ur', ns, ur);

i18n.setDefaultNamespace(ns);
i18n.changeLanguage('en');

export default i18n;
