export const SET_IS_ONLINE = 'SET_IS_ONLINE'

export default (state = true, action) => {
    switch (action.type) {
        case SET_IS_ONLINE: {
            return !state
        }
        default:
            return state
    }
}

export const sGetIsOnline = state => state.isOnline
