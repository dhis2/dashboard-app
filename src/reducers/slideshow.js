export const SET_SLIDESHOW = 'SET_SLIDESHOW'

export default (state = null, action) => {
    switch (action.type) {
        case SET_SLIDESHOW: {
            return action.value
        }
        default:
            return state
    }
}

export const sGetSlideshow = (state) => state.slideshow
