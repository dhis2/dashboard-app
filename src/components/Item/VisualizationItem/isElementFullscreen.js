import { getGridItemDomElementClassName } from '../../../modules/getGridItemDomElementClassName.js'

export const isElementFullscreen = (itemId) => {
    const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement

    return fullscreenElement?.classList.contains(
        getGridItemDomElementClassName(itemId)
    )
}
