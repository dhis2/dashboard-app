import i18n from 'd2-i18n';
import {
    itemTypeMap,
    spacerContent,
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_CHART,
    EVENT_REPORT,
    USERS,
    REPORTS,
    RESOURCES,
    APP,
    MESSAGES,
    TEXT,
    SPACER,
} from '../../modules/itemTypes';

export const singleItems = [
    {
        id: 'additional',
        header: 'Additional items',
        items: [
            {
                type: TEXT,
                name: i18n.t('Text box'),
                content: '',
            },
            {
                type: MESSAGES,
                name: i18n.t('Messages'),
                content: 'true',
            },
            {
                type: SPACER,
                name: i18n.t('Spacer'),
                content: spacerContent,
            },
        ],
    },
];

export const listItems = [
    {
        id: REPORT_TABLE,
        title: itemTypeMap[REPORT_TABLE].pluralTitle,
    },
    {
        id: CHART,
        title: itemTypeMap[CHART].pluralTitle,
    },
    { id: MAP, title: itemTypeMap[MAP].pluralTitle },
    {
        id: EVENT_REPORT,
        title: itemTypeMap[EVENT_REPORT].pluralTitle,
    },
    {
        id: EVENT_CHART,
        title: itemTypeMap[EVENT_CHART].pluralTitle,
    },
    {
        id: USERS,
        title: itemTypeMap[USERS].pluralTitle,
    },
    {
        id: REPORTS,
        title: itemTypeMap[REPORTS].pluralTitle,
    },
    {
        id: RESOURCES,
        title: itemTypeMap[RESOURCES].pluralTitle,
    },
    { id: APP, title: itemTypeMap[APP].pluralTitle },
];
