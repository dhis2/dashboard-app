import { SET_SLIDESHOW } from '../reducers/slideshow.js'

export const acSetSlideshow = (isSlideshow) => ({
    type: SET_SLIDESHOW,
    value: isSlideshow,
})
