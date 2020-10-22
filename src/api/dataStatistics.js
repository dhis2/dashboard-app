import { getInstance } from 'd2'
import { getDataStatisticsName } from '../modules/itemTypes'

export const apiPostDataStatistics = async (eventType, id) => {
    const d2 = await getInstance()
    const url = `dataStatistics?eventType=${eventType}&favorite=${id}`

    d2.Api.getApi().post(url)
}

// update data statistics
export const apiPostFavoriteDataStatistics = async (id, type) => {
    if (getDataStatisticsName(type)) {
        const d2 = await getInstance()
        const dsType = getDataStatisticsName(type)
        const url = `dataStatistics?eventType=${dsType}&favorite=${id}`

        d2.Api.getApi().post(url)
    }
}
