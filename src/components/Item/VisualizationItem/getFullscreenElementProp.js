const getBrowserFullscreenElementProp = () => {
    if (typeof document.fullscreenElement !== 'undefined') {
        return 'fullscreenElement'
    } else if (typeof document.mozFullScreenElement !== 'undefined') {
        return 'mozFullScreenElement'
    } else if (typeof document.msFullscreenElement !== 'undefined') {
        return 'msFullscreenElement'
    } else if (typeof document.webkitFullscreenElement !== 'undefined') {
        return 'webkitFullscreenElement'
    } else {
        throw new Error('fullscreenElement is not supported by this browser')
    }
}

export default getBrowserFullscreenElementProp
