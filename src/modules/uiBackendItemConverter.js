import { TEXT, SPACER, PAGEBREAK } from './itemTypes';
import { getGridItemProperties } from '../components/ItemGrid/gridUtil';

export const spacerContent = 'SPACER_ITEM_FOR_DASHBOARD_LAYOUT_CONVENIENCE';
export const emptyTextItemContent = 'TEXT_ITEM_WITH_NO_CONTENT';

export const pagebreakContent = 'PAGEBREAK_ITEM_FOR_DASHBOARD_PRINTING';

const isBackendSpacerType = item =>
    item.type === TEXT && item.text === spacerContent;
const isBackendPagebreakType = item =>
    item.type === TEXT && item.text === pagebreakContent;
const isUiSpacerType = item => item.type === SPACER;
const isUiPagebreakType = item => item.type === PAGEBREAK;
const isTextType = item => item.type === TEXT && item.text !== spacerContent;

export const convertUiItemsToBackend = items =>
    items.map(item => {
        let text = null;
        if (isUiSpacerType(item)) {
            text = spacerContent;
        } else if (isUiPagebreakType(item)) {
            text = pagebreakContent;
        } else if (isTextType(item)) {
            text = item.text || emptyTextItemContent;
        }

        return {
            ...item,
            ...(text ? { text } : {}),
        };
    });

export const convertBackendItemsToUi = items =>
    items.map(item => {
        let type;
        if (isBackendSpacerType(item)) {
            type = SPACER;
        } else if (isBackendPagebreakType(item)) {
            type = PAGEBREAK;
        } else {
            type = item.type;
        }
        //    const type = isBackendSpacerType(item) ? SPACER : item.type;
        const gridProperties = getGridItemProperties(item.id);

        const text = isTextType(item)
            ? item.text === emptyTextItemContent
                ? ''
                : item.text
            : null;

        const props = {
            ...item,
            ...(text !== null ? { text } : {}),
            type,
            ...gridProperties,
        };
        // if (type === PAGEBREAK) {
        //     props.isResizable = false;
        // }
        return props;
    });
