export const SET_USERNAME = 'SET_USERNAME'

export const DEFAULT_STATE_USERNAME = ''

export default (state = DEFAULT_STATE_USERNAME, action) => {
    switch (action.type) {
        case SET_USERNAME: {
            return action.value.username
        }
        default:
            return state
    }
}

// selectors

export const sGetUsername = state => state.username
