import { apiGetShowDescription } from '../api/description'

import { SET_SHOWDESCRIPTION } from '../reducers/showDescription'

export const acSetShowDescription = value => ({
    type: SET_SHOWDESCRIPTION,
    value,
})

export const tSetShowDescription = () => async dispatch => {
    const onSuccess = value => {
        dispatch(acSetShowDescription(value))
    }

    try {
        const showDescription = await apiGetShowDescription()
        return onSuccess(showDescription)
    } catch (err) {
        console.error('Error (apiGetShowDescription): ', err)
        return err
    }
}
