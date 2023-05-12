import sortBy from 'lodash/sortBy.js'
import {
    MAP,
    VISUALIZATION,
    EVENT_VISUALIZATION,
    REPORT_TABLE,
    CHART,
} from './itemTypes.js'

export const getFirstOfTypes = items => {
    const firstOfTypes = {}

    firstOfTypes[MAP] = sortBy(
        items.filter(item => item.type === MAP),
        ['y', 'x']
    )[0]?.id

    firstOfTypes[EVENT_VISUALIZATION] = sortBy(
        items.filter(item => item.type === EVENT_VISUALIZATION),
        ['y', 'x']
    )[0]?.id

    firstOfTypes[VISUALIZATION] = sortBy(
        items.filter(item =>
            [VISUALIZATION, REPORT_TABLE, CHART].includes(item.type)
        ),
        ['y', 'x']
    )[0]?.id

    return Object.values(firstOfTypes).filter(id => id !== undefined)
}
