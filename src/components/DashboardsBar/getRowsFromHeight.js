/*
ROW_HEIGHT is the height of a chip + the gap between chips.
An extra 6px for the top padding is applied to the FIRST_ROW_HEIGHT
*/
const FIRST_ROW_HEIGHT = 44 // 32px chip + 6x top padding + 6px gap
const ROW_HEIGHT = 38 // 32px chip + 6px gap

export const getRowsFromHeight = (height) => {
    if (height <= FIRST_ROW_HEIGHT) {
        return 1
    }
    return 1 + Math.abs(Math.round((height - FIRST_ROW_HEIGHT) / ROW_HEIGHT))
}
