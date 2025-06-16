import { getVisualizationId } from '../modules/item.js'
import {
    getEndPointName,
    MAP,
    EVENT_VISUALIZATION,
} from '../modules/itemTypes.js'
import { getMapFields, getFavoriteFields } from './metadata.js'

export const apiFetchVisualization = async (item, dataEngine) => {
    const id = getVisualizationId(item)
    const fields =
        item.type === MAP
            ? getMapFields()
            : getFavoriteFields({
                  withDimensions: true,
                  withOptions: true,
                  withRepetition: item.type === EVENT_VISUALIZATION,
              })

    return await dataEngine.query({
        [item.type]: {
            resource: getEndPointName(item.type),
            id,
            params: {
                fields,
            },
        },
    })
}
