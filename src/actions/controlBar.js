import { apiGetControlBarRows } from '../api/controlBar.js'
import { SET_CONTROLBAR_USER_ROWS } from '../reducers/controlBar.js'

// actions

export const acSetControlBarUserRows = (rows) => ({
    type: SET_CONTROLBAR_USER_ROWS,
    value: rows,
})

// thunks

export const tSetControlBarRows = () => async (dispatch) => {
    const onSuccess = (rows) => {
        dispatch(acSetControlBarUserRows(rows))
    }

    const onError = (error) => {
        console.log('Error (apiGetControlBarRows): ', error)
        return error
    }

    try {
        const controlBarRows = await apiGetControlBarRows()
        return onSuccess(controlBarRows)
    } catch (err) {
        return onError(err)
    }
}
