import {
    VIS_TYPE_COLUMN,
    VIS_TYPE_PIVOT_TABLE,
    getAdaptedUiLayoutByType,
} from '@dhis2/analytics'
import { REPORT_TABLE, CHART, MAP } from '../../../../modules/itemTypes'

export const THEMATIC_LAYER = 'thematic'

const extractMapView = map =>
    map.mapViews && map.mapViews.find(mv => mv.layer.includes(THEMATIC_LAYER))

const getWithoutId = object => ({
    ...object,
    id: undefined,
})

const getVisualizationConfig = (visualization, originalType, activeType) => {
    if (originalType === MAP && originalType !== activeType) {
        const extractedMapView = extractMapView(visualization)

        if (extractedMapView === undefined) {
            return null
        }

        return getWithoutId({
            ...visualization,
            ...extractedMapView,
            mapViews: undefined,
            type: activeType === CHART ? VIS_TYPE_COLUMN : VIS_TYPE_PIVOT_TABLE,
        })
    } else if (originalType === REPORT_TABLE && activeType === CHART) {
        const layout = getAdaptedUiLayoutByType(visualization, activeType)
        return getWithoutId({
            ...visualization,
            ...layout,
            type: VIS_TYPE_COLUMN,
        })
    } else if (originalType === CHART && activeType === REPORT_TABLE) {
        return getWithoutId({
            ...visualization,
            type: VIS_TYPE_PIVOT_TABLE,
        })
    }

    return getWithoutId(visualization)
}

export default getVisualizationConfig
