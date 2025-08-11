import { SET_SLIDESHOW, EXIT_SLIDESHOW } from '../reducers/slideshow.js'

export const acSetSlideshow = (slideshowState) => ({
    type: SET_SLIDESHOW,
    value: slideshowState,
})

export const acExitSlideshow = () => ({
    type: EXIT_SLIDESHOW,
})
