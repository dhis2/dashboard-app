import isObject from 'lodash/isObject'
import { itemTypeMap } from './itemTypes'

export const getVisualizationFromItem = item => {
    if (!isObject(item)) {
        return null
    }

    const propName = itemTypeMap[item.type]?.propName

    return (
        item[propName] ||
        item.reportTable ||
        item.chart ||
        item.map ||
        item.eventReport ||
        item.eventChart ||
        {}
    )
}
