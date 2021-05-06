export const SET_SHOW_DESCRIPTION = 'SET_SHOW_DESCRIPTION'

export const DEFAULT_STATE_SHOW_DESCRIPTION = false

export default (state = DEFAULT_STATE_SHOW_DESCRIPTION, action) => {
    switch (action.type) {
        case SET_SHOW_DESCRIPTION: {
            return action.value
        }
        default:
            return state
    }
}

export const sGetShowDescription = state => state.showDescription
