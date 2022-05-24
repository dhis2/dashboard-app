import { getInstance } from 'd2'
import { getVisualizationId } from '../modules/item.js'
import { getEndPointName, MAP } from '../modules/itemTypes.js'
import { getMapFields, getFavoriteFields } from './metadata.js'

export const apiFetchVisualization = async (item) => {
    const id = getVisualizationId(item)
    const fields =
        item.type === MAP
            ? getMapFields()
            : getFavoriteFields({
                  withDimensions: true,
                  withOptions: true,
              })

    const d2 = await getInstance()

    return await d2.Api.getApi().get(`${getEndPointName(item.type)}/${id}`, {
        fields,
    })
}
