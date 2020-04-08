import {
    convertBackendItemsToUi,
    convertUiItemsToBackend,
    spacerContent,
    emptyTextItemContent,
} from '../uiBackendItemConverter';
import { VISUALIZATION, SPACER, TEXT } from '../itemTypes';

const visualizationItem = {
    id: 'visualization item',
    type: VISUALIZATION,
    visualization: {},
};

describe('convertUiItemsToBackend', () => {
    it('sets content for SPACER type', () => {
        const uiItems = [
            {
                id: 'spacer item',
                type: SPACER,
            },
        ];
        expect(convertUiItemsToBackend(uiItems)).toMatchObject([
            {
                id: 'spacer item',
                type: SPACER,
                text: spacerContent,
            },
        ]);
    });

    it('sets empty content for empty TEXT type', () => {
        const uiItems = [
            {
                id: 'empty text item',
                type: TEXT,
                text: '',
            },
        ];
        expect(convertUiItemsToBackend(uiItems)).toMatchObject([
            {
                id: 'empty text item',
                type: TEXT,
                text: emptyTextItemContent,
            },
        ]);
    });

    it('does not add text property to VISUALIZATION type', () => {
        const uiItems = [visualizationItem];

        expect(convertUiItemsToBackend(uiItems)).toMatchObject([
            visualizationItem,
        ]);
    });
});

describe('convertBackendItemsToUi', () => {
    it('converts backend spacer item to SPACER type', () => {
        const backendItems = [
            {
                id: 'spacer item',
                type: TEXT,
                text: spacerContent,
            },
        ];

        expect(convertBackendItemsToUi(backendItems)).toMatchObject([
            {
                id: 'spacer item',
                type: SPACER,
                text: spacerContent,
            },
        ]);
    });

    it('converts content of empty TEXT type to empty string', () => {
        const backendItems = [
            {
                id: 'empty text item',
                type: TEXT,
                text: emptyTextItemContent,
            },
        ];

        expect(convertBackendItemsToUi(backendItems)).toMatchObject([
            {
                id: 'empty text item',
                type: TEXT,
                text: '',
            },
        ]);
    });

    it('does not change VISUALIZATION type', () => {
        const backendItems = [visualizationItem];

        expect(convertBackendItemsToUi(backendItems)).toMatchObject([
            visualizationItem,
        ]);
    });
});
