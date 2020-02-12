import {
    CHART,
    MAP,
    REPORT_TABLE,
    EVENT_CHART,
    EVENT_REPORT,
} from './itemTypes';

export const hasMapView = itemType =>
    [REPORT_TABLE, CHART, MAP].includes(itemType);

export const isEvent = itemType => {
    return [EVENT_CHART, EVENT_REPORT].includes(itemType);
};
