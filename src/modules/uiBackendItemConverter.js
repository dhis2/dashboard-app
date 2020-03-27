import { spacerContent, TEXT, SPACER } from './itemTypes';

const emptyTextItemContent = 'TEXT_ITEM_WITH_NO_CONTENT';
const isSpacerType = item => item.type === TEXT && item.text === spacerContent;

export const isTextType = item =>
    item.type === TEXT && item.text !== spacerContent;

export const convertUiItemsToBackend = items => {
    return items.map(item => {
        const text = isTextType(item)
            ? item.text || emptyTextItemContent
            : null;

        return {
            ...item,
            ...(text ? { text } : {}),
        };
    });
};

export const convertBackendItemsToUi = items => {
    return items.map(item => {
        const type = isSpacerType(item) ? SPACER : item.type;

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
