import { apiGetShowDescription } from '../api/description.js'
import { SET_SHOW_DESCRIPTION } from '../reducers/showDescription.js'

export const acSetShowDescription = (value) => ({
    type: SET_SHOW_DESCRIPTION,
    value,
})

export const tSetShowDescription = () => async (dispatch) => {
    const onSuccess = (value) => {
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
