export const SET_IS_ONLINE = 'SET_IS_ONLINE'

export default (state = true, action) => {
    switch (action.type) {
        case SET_IS_ONLINE: {
            if (!action.value) {
                return !state
            }
            return action.value
        }
        default:
            return state
    }
}

export const sGetIsOnline = state => state.isOnline
