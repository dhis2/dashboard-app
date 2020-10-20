// import { VIS_TYPE_COLUMN, VIS_TYPE_PIVOT_TABLE } from '@dhis2/analytics'

import getVisualizationConfig, {
    THEMATIC_LAYER,
} from '../getVisualizationConfig'
import { REPORT_TABLE, CHART, MAP } from '../../../../../modules/itemTypes'

jest.mock('@dhis2/analytics', () => {
    return {
        VIS_TYPE_COLUMN: 'COLUMN',
        VIS_TYPE_PIVOT_TABLE: 'PIVOT_TABLE',
        layoutGetAdaptedLayoutForType: () => true,
    }
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
            type: 'PIVOT_TABLE',
        }

        expect(actualResult).toEqual(expectedResult)
    })

    it.skip('returns correct config when switching from REPORT_TABLE to CHART', () => {
        const actualResult = getVisualizationConfig(
            visualization,
            REPORT_TABLE,
            CHART
        )
        const expectedResult = {
            ...visualization,
            id: undefined,
            type: 'COLUMN',
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
        const actualResult = getVisualizationConfig(visualization, MAP, CHART)
        const expectedResult = {
            ...visualization.mapViews[0],
            mapViews: undefined,
            id: undefined,
            type: 'COLUMN',
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
        const actualResult = getVisualizationConfig(visualization, MAP, CHART)

        expect(actualResult).toEqual(null)
    })
})
