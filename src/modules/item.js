import isObject from 'lodash/isObject.js'
import { itemTypeMap } from './itemTypes.js'

export const getVisualizationFromItem = (item) => {
    if (!isObject(item)) {
        return null
    }

    const propName = itemTypeMap[item.type]?.propName

    return (
        item[propName] ||
        item.visualization ||
        item.map ||
        item.eventReport ||
        item.eventChart ||
        {}
    )
}

export const getVisualizationId = (item) => getVisualizationFromItem(item).id

export const getVisualizationName = (item) =>
    getVisualizationFromItem(item).name
