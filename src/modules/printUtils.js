import sortBy from 'lodash/sortBy'
import { orArray } from './util'
import { itemTypeMap } from './itemTypes'
// for A4 landscape (297x210mm)
// 794 px = (21cm / 2.54) * 96 pixels/inch
// 1122 px = 29.7 /2.54 * 96 pixels/inch
// const a4LandscapeHeightPx = 794
export const a4LandscapeWidthPx = 1102

export const MAX_ITEM_GRID_HEIGHT = 33

export const getTransformYPx = elStyle => {
    if (!elStyle || !elStyle.transform) {
        return null
    }

    const transformY = elStyle.transform.split(' ')[1]?.slice(0, -1)

    if (!transformY || transformY.slice(-2) !== 'px') {
        return null
    }

    const tY = parseInt(transformY.slice(0, -2))

    return !isNaN(tY) ? tY : null
}

export const getDomGridItemsSortedByYPos = elements => {
    const types = Object.keys(itemTypeMap)
    const elementsWithBoundingRect = orArray(elements).map(el => {
        const type = Array.from(el.classList).find(
            className => types.indexOf(className) > -1
        )

        const rect = el.getBoundingClientRect()
        const y = getTransformYPx(el.style) || parseInt(rect.y)

        return {
            type,
            classList: el.classList,
            bottomY: y + parseInt(rect.height),
            el,
        }
    })
    return sortBy(elementsWithBoundingRect, ['bottomY'])
}
