import sortBy from 'lodash/sortBy'
import { orArray } from './util'
import { itemTypeMap } from './itemTypes'
// for A4 landscape (297x210mm)
// 794 px = (21cm / 2.54) * 96 pixels/inch
// 1122 px = 29.7 /2.54 * 96 pixels/inch
// const a4LandscapeHeightPx = 794
export const a4LandscapeWidthPx = 1102

export const MAX_ITEM_GRID_HEIGHT = 33

export const getTransformY = elStyle => {
    if (!elStyle.transform) {
        return null
    }

    console.log('elStyle', elStyle.transform)
    return parseInt(elStyle.transform.split(' ')[1]?.slice(0, -3))
}

export const getDomGridItemsSortedByYPos = elements => {
    const types = Object.keys(itemTypeMap)
    const elementsWithBoundingRect = orArray(elements).map(el => {
        const type = Array.from(el.classList).find(
            className => types.indexOf(className) > -1
        )

        const rect = el.getBoundingClientRect()

        const y = el.style.transform
            ? parseInt(getTransformY(el.style))
            : parseInt(rect.y)

        return {
            type,
            classList: el.classList,
            bottomY: y + parseInt(rect.height),
            el,
        }
    })
    return sortBy(elementsWithBoundingRect, ['bottomY'])
}
