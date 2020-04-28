import * as d2lib from 'd2'
import { VIS_TYPE_COLUMN, VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'
import { fetch, getVisualizationConfig, THEMATIC_LAYER } from '../plugin'
import { CHART, MAP, REPORT_TABLE } from '../../../../modules/itemTypes'
import * as apiMetadata from '../../../../api/metadata'

describe('plugin', () => {
    describe('fetch', () => {
        let mockD2
        let mockGetFn

        beforeEach(() => {
            mockGetFn = jest.fn().mockResolvedValue({ pager: {} })
            mockD2 = { Api: { getApi: () => ({ get: mockGetFn }) } }
            d2lib.getInstance = () => Promise.resolve(mockD2)
            apiMetadata.apiFetchFavorite = jest.fn()
        })

        it('fires apiFetchFavorite request', async done => {
            const item = { type: CHART, chart: { id: 'SOME_ID' } }

            await fetch(item)

            expect(apiMetadata.apiFetchFavorite).toHaveBeenCalledTimes(1)

            done()
        })
    })

    describe('getVisualizationConfig', () => {
        let visualization

        beforeEach(() => {
            visualization = { id: 'SOME_ID', someProp: 'someValue' }
        })

        it('returns default visualization when original type equals active type', () => {
            const actualResult = getVisualizationConfig(visualization, MAP, MAP)
            const expectedResult = {
                ...visualization,
                id: undefined,
            }

            expect(actualResult).toEqual(expectedResult)
        })

        it('returns correct config when switching from CHART to REPORT_TABLE', () => {
            const actualResult = getVisualizationConfig(
                visualization,
                CHART,
                REPORT_TABLE
            )
            const expectedResult = {
                ...visualization,
                id: undefined,
                type: VIS_TYPE_PIVOT_TABLE,
            }

            expect(actualResult).toEqual(expectedResult)
        })

        it('returns correct config when switching from REPORT_TABLE to CHART', () => {
            const actualResult = getVisualizationConfig(
                visualization,
                REPORT_TABLE,
                CHART
            )
            const expectedResult = {
                ...visualization,
                id: undefined,
                type: VIS_TYPE_COLUMN,
            }

            expect(actualResult).toEqual(expectedResult)
        })

        it('extracts map analytical object and prepares for plugins', () => {
            visualization = {
                mapViews: [
                    {
                        ...visualization,
                        layer: THEMATIC_LAYER,
                    },
                ],
            }
            const actualResult = getVisualizationConfig(
                visualization,
                MAP,
                CHART
            )
            const expectedResult = {
                ...visualization.mapViews[0],
                mapViews: undefined,
                id: undefined,
                type: VIS_TYPE_COLUMN,
            }

            expect(actualResult).toEqual(expectedResult)
        })

        it('returns null if extracting mapview results undefined', () => {
            visualization = {
                mapViews: [
                    {
                        ...visualization,
                        layer: 'event',
                    },
                ],
            }
            const actualResult = getVisualizationConfig(
                visualization,
                MAP,
                CHART
            )

            expect(actualResult).toEqual(null)
        })
    })
})
