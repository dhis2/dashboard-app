import { SET_SLIDESHOW, EXIT_SLIDESHOW } from '../reducers/slideshow.js'

export const acSetSlideshow = (slideshowSettings) => ({
    type: SET_SLIDESHOW,
    value: slideshowSettings,
})

export const acExitSlideshow = () => ({
    type: EXIT_SLIDESHOW,
})
