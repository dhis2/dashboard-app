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
} from '../itemTypes';

export const singleItems = [
    {
        id: 'additional',
        header: 'Additional items',
        items: [
            {
                type: TEXT,
                icon: 'FontDownload',
                name: 'Text box',
                content: 'No content',
            },
            {
                type: MESSAGES,
                icon: 'Email',
                name: 'Messages',
                content: 'true',
            },
            {
                type: SPACER,
                icon: 'CropFree',
                name: 'Spacer',
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
