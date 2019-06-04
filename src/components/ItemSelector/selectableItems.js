import i18n from '@dhis2/d2-i18n';
import {
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
        header: i18n.t('Additional items'),
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

// categorizedItems are grouped in the item selector menu
export const categorizedItems = [
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    USERS,
    REPORTS,
    RESOURCES,
    APP,
];

// listItemTypes are included in a single dashboard item
export const listItemTypes = [REPORTS, RESOURCES, USERS];
