import { TEXT, SPACER } from './itemTypes';

export const spacerContent = 'SPACER_ITEM_FOR_DASHBOARD_LAYOUT_CONVENIENCE';
export const emptyTextItemContent = 'TEXT_ITEM_WITH_NO_CONTENT';

const isBackendSpacerType = item =>
    item.type === TEXT && item.text === spacerContent;
const isUiSpacerType = item => item.type === SPACER;
const isTextType = item => item.type === TEXT && item.text !== spacerContent;

export const convertUiItemsToBackend = items => {
    return items.map(item => {
        let text = null;
        if (isUiSpacerType(item)) {
            text = spacerContent;
        } else if (isTextType(item)) {
            text = item.text || emptyTextItemContent;
        }

        return {
            ...item,
            ...(text ? { text } : {}),
        };
    });
};

export const convertBackendItemsToUi = items => {
    return items.map(item => {
        const type = isBackendSpacerType(item) ? SPACER : item.type;

        const text = isTextType(item)
            ? item.text === emptyTextItemContent
                ? ''
                : item.text
            : null;

        return {
            ...item,
            ...(text !== null ? { text } : {}),
            type,
        };
    });
};
