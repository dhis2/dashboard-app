import { SET_DIMENSIONS } from '../reducers/dimensions'
import { apiFetchDimensions } from '@dhis2/analytics'
import { sGetSettingsDisplayNameProperty } from '../reducers/settings'

export const acSetDimensions = dimensions => ({
    type: SET_DIMENSIONS,
    value: dimensions,
})

export const tSetDimensions = () => async (dispatch, getState, dataEngine) => {
    const onSuccess = dimensions => {
        dispatch(acSetDimensions(dimensions))
    }

    const onError = error => {
        console.log('Error (apiFetchDimensions): ', error)
        return error
    }

    try {
        const displayNameProp = sGetSettingsDisplayNameProperty(getState())
        const dimensions = await apiFetchDimensions(dataEngine, displayNameProp)

        // filter out CATEGORY that are not of type ATTRIBUTE
        const filteredDimensions = dimensions.filter(
            dim =>
                dim.dimensionType !== 'CATEGORY' ||
                (dim.dimensionType === 'CATEGORY' &&
                    dim.dataDimensionType === 'ATTRIBUTE')
        )
        return onSuccess(filteredDimensions)
    } catch (err) {
        return onError(err)
    }
}
