import { SET_SETTINGS, ADD_SETTINGS } from '../reducers/settings'
import { apiFetchSystemSettings } from '../api/settings'
//import { apiFetchOrganisationUnitRoot } from '../api/organisationUnits'

export const acSetSettings = value => ({
    type: SET_SETTINGS,
    value,
})

export const acAddSettings = value => ({
    type: ADD_SETTINGS,
    value,
})

export const tAddSettings = (...extraSettings) => async dispatch => {
    const onSuccess = fetchedSettings => {
        dispatch(
            acAddSettings(Object.assign({}, fetchedSettings, ...extraSettings))
        )
    }

    const onError = error => {
        console.log('Error (apiFetchSystemSettings): ', error)
        return error
    }

    try {
        const systemSettings = await apiFetchSystemSettings();
        //const rootOrganisationUnit = await apiFetchOrganisationUnitRoot()

        return onSuccess({
            ...systemSettings,
            //rootOrganisationUnit,
        })
    } catch (err) {
        return onError(err)
    }
}
