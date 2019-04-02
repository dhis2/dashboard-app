import * as d2lib from 'd2';
import { fetch, getVisualizationConfig, THEMATIC_LAYER } from '../plugin';
import { CHART, MAP } from '../../../../modules/itemTypes';
import * as apiMetadata from '../../../../api/metadata';

describe('plugin', () => {
    describe('fetch', () => {
        let mockD2;
        let mockGetFn;

        beforeEach(() => {
            mockGetFn = jest.fn().mockResolvedValue({ pager: {} });
            mockD2 = { Api: { getApi: () => ({ get: mockGetFn }) } };
            d2lib.getInstance = () => Promise.resolve(mockD2);
            apiMetadata.apiFetchFavorite = jest.fn();
        });

        it('fires apiFetchFavorite request', async done => {
            const item = { type: CHART, chart: { id: 'SOME_ID' } };

            await fetch(item);

            expect(apiMetadata.apiFetchFavorite).toHaveBeenCalledTimes(1);

            done();
        });
    });

    describe('getVisualizationConfig', () => {
        let visualization;

        beforeEach(() => {
            visualization = { id: 'SOME_ID', someProp: 'someValue' };
        });

        it('returns default visualization when original type equals to active type', () => {
            const actualResult = getVisualizationConfig(
                visualization,
                MAP,
                MAP
            );
            const expectedResult = {
                ...visualization,
                id: undefined,
            };

            expect(actualResult).toEqual(expectedResult);
        });

        it('extracts map analytical object and prepares for plugins', () => {
            visualization = {
                mapViews: [
                    {
                        ...visualization,
                        layer: THEMATIC_LAYER,
                    },
                ],
            };
            const actualResult = getVisualizationConfig(
                visualization,
                MAP,
                CHART
            );
            const expectedResult = {
                ...visualization.mapViews[0],
                mapViews: undefined,
                id: undefined,
            };

            expect(actualResult).toEqual(expectedResult);
        });
    });
});
