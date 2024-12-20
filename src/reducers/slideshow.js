export const SET_SLIDESHOW = 'SET_SLIDESHOW'

export default (state = null, action) => {
    if (action.type === SET_SLIDESHOW) {
        return action.value
    }
    return state
}

export const sGetSlideshow = (state) => state.slideshow
