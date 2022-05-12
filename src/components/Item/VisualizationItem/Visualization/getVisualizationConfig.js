import {
    VIS_TYPE_COLUMN,
    VIS_TYPE_PIVOT_TABLE,
    getAdaptedUiLayoutByType,
} from '@dhis2/analytics'
import { REPORT_TABLE, CHART, MAP } from '../../../../modules/itemTypes'
import getThematicMapViews from '../getThematicMapViews'

const getWithoutId = (object) => ({
    ...object,
    id: undefined,
})

const getVisualizationConfig = (visualization, originalType, activeType) => {
    if (originalType === MAP && originalType !== activeType) {
        const thematicMapViews = getThematicMapViews(visualization)

        if (thematicMapViews === undefined) {
            return null
        }

        return getWithoutId({
            ...visualization,
            ...thematicMapViews,
            mapViews: undefined,
            type: activeType === CHART ? VIS_TYPE_COLUMN : VIS_TYPE_PIVOT_TABLE,
        })
    } else if (originalType === REPORT_TABLE && activeType === CHART) {
        const layout = getAdaptedUiLayoutByType(visualization, VIS_TYPE_COLUMN)
        return getWithoutId({
            ...visualization,
            ...layout,
            type: VIS_TYPE_COLUMN,
        })
    } else if (originalType === CHART && activeType === REPORT_TABLE) {
        const layout = getAdaptedUiLayoutByType(
            visualization,
            VIS_TYPE_PIVOT_TABLE
        )
        return getWithoutId({
            ...visualization,
            ...layout,
            type: VIS_TYPE_PIVOT_TABLE,
        })
    }

    return getWithoutId(visualization)
}

export default getVisualizationConfig
