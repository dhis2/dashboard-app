/* ROW_HEIGHT is the height of a chip + the gap between chips.
 But this isn't correct for the first or last row in the dashboards bar
    because the gap is only applied between rows, not at the top or bottom.
    So the first and last row are actually 3px shorter than the other rows, i.e. 35px
    But in order to keep the calculation simple, we'll just use 38px for all rows, while
    subtracting 3px from PADDING_TOP (which is actually 6px)
*/
const FIRST_ROW_HEIGHT = 35 // 32px chip + 3px gap (only 1/2 of the gap for first row)
const ROW_HEIGHT = 38 // 32px chip + 6px gap
const PADDING_TOP = 6

export const getRowsFromHeight = (height) => {
    if (height <= PADDING_TOP + FIRST_ROW_HEIGHT) {
        return 1
    }
    return 1 + Math.abs(Math.round(
        (height - PADDING_TOP - FIRST_ROW_HEIGHT) / ROW_HEIGHT
    ))
}
