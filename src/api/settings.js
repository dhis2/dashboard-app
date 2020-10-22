import { getInstance } from 'd2'
import { onError } from './index'
import { SYSTEM_SETTINGS } from '../modules/settings'

export const apiFetchSystemSettings = () => {
    const endPoint = '/systemSettings'
    const url = `${endPoint}?${SYSTEM_SETTINGS.map(s => `key=${s}`).join('&')}`

    return getInstance()
        .then(d2 => d2.Api.getApi().get(url))
        .catch(onError)
}

export const apiFetchUserSettings = () => {
    // "key" params not supported in the backend yet
    // update: now it is, should be used here
    const endPoint = '/userSettings'

    return getInstance()
        .then(d2 => d2.Api.getApi().get(endPoint))
        .catch(onError)
}
