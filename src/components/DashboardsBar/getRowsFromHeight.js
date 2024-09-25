const ROW_HEIGHT = 32
const PADDING_TOP = 6
const SHOWMORE_BUTTON_HEIGHT = 0 // No longer shown under the chip area

export const getRowsFromHeight = (height) => {
    return Math.round(
        (height - SHOWMORE_BUTTON_HEIGHT - PADDING_TOP) / ROW_HEIGHT
    )
}
