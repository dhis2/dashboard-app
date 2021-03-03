import { validateReducer } from '../modules/util'

export const SET_ISLOADING = 'SET_ISLOADING'

export const DEFAULT_STATE_ISLOADING = false

const isLoading = (state = DEFAULT_STATE_ISLOADING, action) => {
    switch (action.type) {
        case SET_ISLOADING:
            return validateReducer(action.value, DEFAULT_STATE_ISLOADING)
        default:
            return state
    }
}

export default isLoading

export const sGetIsLoading = state => state.isLoading
