import sortBy from 'lodash/sortBy'
import { orArray } from './util'
import { itemTypeMap } from './itemTypes'
// for A4 landscape (297x210mm)
// 794 px = (21cm / 2.54) * 96 pixels/inch
// 1122 px = 29.7 /2.54 * 96 pixels/inch
// const a4LandscapeHeightPx = 794
export const a4LandscapeWidthPx = 1102

export const MAX_ITEM_GRID_HEIGHT = 34

export const getTransformYPx = elStyle => {
    if (!elStyle || !elStyle.transform) {
        return null
    }

    // find valid transforms - those with y pixels
    // the code is expecting the transform prop to
    // look like:  translate(10px, 300px)
    const transformY = elStyle.transform.split(' ')[1]?.match(/(\d+)px/)
    if (transformY) {
        return parseInt(transformY[1])
    } else {
        return null
    }
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
