import { getOriginalHeight, MARGIN } from './gridUtil'

// for A4 landscape (297x210mm)
// 794 px = (21cm / 2.54) * 96 pixels/inch
// 1122 px = 29.7 /2.54 * 96 pixels/inch
const a4LandscapeHeightPx = 794
// const a4LandscapeWidthPx = 1122

const sortItemsByYPosition = items => {
    return items.sort((a, b) => {
        if (a.y < b.y) {
            return -2
        } else if (a.y === b.y) {
            if (a.x < b.x) {
                return -1
            }
        }

        return 1
    })
}

export const getNumPrintPages = items => {
    if (!items.length) {
        return 1
    }
    const sortedItems = sortItemsByYPosition(items)

    // then subtract the top and bottom margins
    const marginHeightPx = MARGIN[0] + MARGIN[1]
    const pageHeight = a4LandscapeHeightPx - marginHeightPx
    // const pageWidth = 1122 - margin
    // const pageWidthPx = `${pageWidth}px`

    const lastItem = sortedItems[sortedItems.length - 1]
    const h = lastItem.y + lastItem.h
    const gridHeight = getOriginalHeight({ h }).originalHeight

    const numPages = Math.ceil(gridHeight / pageHeight)

    return numPages
}
