import { SET_SLIDESHOW } from '../reducers/slideshow.js'

export const acSetSlideshow = (slideIndex) => ({
    type: SET_SLIDESHOW,
    value: slideIndex,
})
