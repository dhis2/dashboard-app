import { getGridItemElement } from './getGridItemElement.js'

export const isFullscreenSupported = (itemId) => {
    const el = getGridItemElement(itemId)
    return !!(el?.requestFullscreen || el?.webkitRequestFullscreen)
}
