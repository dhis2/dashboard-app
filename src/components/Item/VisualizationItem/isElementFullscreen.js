import { getGridItemDomElementClassName } from '../../../modules/getGridItemDomElementClassName.js'

export const isElementFullscreen = (itemId) => {
    const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement

    // if (!fullscreenElement) {
    //     console.log('jj no fs element')
    // }

    const isFullscreen = fullscreenElement?.classList.contains(
        getGridItemDomElementClassName(itemId)
    )
    if (isFullscreen) {
        console.log('jj fs element', fullscreenElement.id)
    }

    return fullscreenElement?.classList.contains(
        getGridItemDomElementClassName(itemId)
    )
}
