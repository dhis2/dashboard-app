import { getInstance } from 'd2'
import { onError } from './index'

const SYSTEM_SETTINGS = ['keyGatherAnalyticalObjectStatisticsInDashboardViews']

export const apiFetchSystemSettings = () => {
    const endPoint = '/systemSettings'
    const url = `${endPoint}?${SYSTEM_SETTINGS.map(s => `key=${s}`).join('&')}`

    return getInstance()
        .then(d2 => d2.Api.getApi().get(url))
        .catch(onError)
}
