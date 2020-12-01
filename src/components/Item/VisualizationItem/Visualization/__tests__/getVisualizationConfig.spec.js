import {
    DIMENSION_ID_DATA,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
} from '@dhis2/analytics'

import getVisualizationConfig, {
    THEMATIC_LAYER,
} from '../getVisualizationConfig'
import { REPORT_TABLE, CHART, MAP } from '../../../../../modules/itemTypes'

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
        const visConfig = {
            id: 'vis1',
            type: 'CHART',
            [AXIS_ID_COLUMNS]: [{ dimension: DIMENSION_ID_DATA }],
            [AXIS_ID_ROWS]: [{ dimension: DIMENSION_ID_PERIOD }],
            [AXIS_ID_FILTERS]: [
                { dimension: DIMENSION_ID_ORGUNIT },
                { dimension: 'rainbow' },
                { dimension: 'twilight' },
            ],
        }
        const actualResult = getVisualizationConfig(
            visConfig,
            CHART,
            REPORT_TABLE
        )
        const expectedResult = {
            ...visConfig,
            id: undefined,
            type: 'PIVOT_TABLE',
        }

        expect(actualResult).toEqual(expectedResult)
    })

    it('returns correct config when switching from REPORT_TABLE to CHART one row item', () => {
        const visConfig = {
            id: 'vis1',
            [AXIS_ID_COLUMNS]: [
                { dimension: DIMENSION_ID_DATA },
                { dimension: 'rainbow' },
            ],
            [AXIS_ID_ROWS]: [{ dimension: DIMENSION_ID_PERIOD }],
            [AXIS_ID_FILTERS]: [
                { dimension: DIMENSION_ID_ORGUNIT },
                { dimension: 'twilight' },
            ],
        }

        const expectedVisConfig = {
            id: undefined,
            type: 'COLUMN',
            [AXIS_ID_COLUMNS]: [{ dimension: DIMENSION_ID_DATA }],
            [AXIS_ID_ROWS]: [{ dimension: DIMENSION_ID_PERIOD }],
            [AXIS_ID_FILTERS]: [
                { dimension: DIMENSION_ID_ORGUNIT },
                { dimension: 'twilight' },
                { dimension: 'rainbow' },
            ],
        }

        const actualResult = getVisualizationConfig(
            visConfig,
            REPORT_TABLE,
            CHART
        )

        expect(actualResult).toEqual(expectedVisConfig)
    })

    it('returns correct config when switching from REPORT_TABLE to CHART >2 row items', () => {
        const visConfig = {
            id: 'vis1',
            [AXIS_ID_COLUMNS]: [
                { dimension: DIMENSION_ID_DATA },
                { dimension: 'rainbow' },
            ],
            [AXIS_ID_ROWS]: [
                { dimension: DIMENSION_ID_PERIOD },
                { dimension: 'twilight' },
                { dimension: 'pinkiepie' },
            ],
            [AXIS_ID_FILTERS]: [{ dimension: DIMENSION_ID_ORGUNIT }],
        }

        const expectedVisConfig = {
            id: undefined,
            type: 'COLUMN',
            [AXIS_ID_COLUMNS]: [{ dimension: DIMENSION_ID_DATA }],
            [AXIS_ID_ROWS]: [
                { dimension: DIMENSION_ID_PERIOD },
                { dimension: 'twilight' },
            ],
            [AXIS_ID_FILTERS]: [
                { dimension: DIMENSION_ID_ORGUNIT },
                { dimension: 'rainbow' },
                { dimension: 'pinkiepie' },
            ],
        }

        const actualResult = getVisualizationConfig(
            visConfig,
            REPORT_TABLE,
            CHART
        )

        expect(actualResult).toEqual(expectedVisConfig)
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
