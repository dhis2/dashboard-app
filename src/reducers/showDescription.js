import { validateReducer } from '../modules/util'

export const SET_SHOWDESCRIPTION = 'SET_SHOWDESCRIPTION'

export const DEFAULT_STATE_SHOWDESCRIPTION = false

const showDescription = (state = DEFAULT_STATE_SHOWDESCRIPTION, action) => {
    switch (action.type) {
        case SET_SHOWDESCRIPTION:
            return validateReducer(action.value, DEFAULT_STATE_SHOWDESCRIPTION)
        default:
            return state
    }
}

export default showDescription

export const sGetShowDescription = state => state.showDescription
