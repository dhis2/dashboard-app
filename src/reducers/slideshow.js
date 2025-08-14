export const SET_SLIDESHOW = 'SET_SLIDESHOW'
export const EXIT_SLIDESHOW = 'EXIT_SLIDESHOW'

const DEFAULT_SLIDESHOW_STATE = {
    firstItemIndex: null,
    startPlaying: null,
}

export default (state = DEFAULT_SLIDESHOW_STATE, action) => {
    if (action.type === SET_SLIDESHOW) {
        return action.value
    } else if (action.type === EXIT_SLIDESHOW) {
        return DEFAULT_SLIDESHOW_STATE
    }
    return state
}

export const sGetSlideshow = (state) => state.slideshow
