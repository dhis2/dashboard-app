import { getGridItemDomElementClassName } from '../../modules/getGridItemDomElementClassName.js'
import { getGridItemElement } from './getGridItemElement.js'

export const isElementFullscreen = (itemId) => {
    const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement

    return fullscreenElement?.classList.contains(
        getGridItemDomElementClassName(itemId)
    )
}

export const isFullscreenSupported = (itemId) => {
    const el = getGridItemElement(itemId)
    return !!(el?.requestFullscreen || el?.webkitRequestFullscreen)
}

export const onToggleFullscreen = (itemId) => {
    if (!isElementFullscreen(itemId)) {
        const el = getGridItemElement(itemId)
        if (el?.requestFullscreen) {
            el.requestFullscreen()
        } else if (el?.webkitRequestFullscreen) {
            el.webkitRequestFullscreen()
        }
    } else {
        document.exitFullscreen
            ? document.exitFullscreen()
            : document.webkitExitFullscreen()
    }
}
