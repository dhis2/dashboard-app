export const SET_WINDOW_HEIGHT = 'SET_WINDOW_HEIGHT'

export const DEFAULT_STATE_WINDOW_HEIGHT = window.innerHeight

export default (state = DEFAULT_STATE_WINDOW_HEIGHT, action) => {
    switch (action.type) {
        case SET_WINDOW_HEIGHT: {
            return action.value
        }
        default:
            return state
    }
}

export const sGetWindowHeight = state => state.windowHeight
