const ROW_HEIGHT = 40
const PADDING_TOP = 10
const SHOWMORE_BUTTON_HEIGHT = 21 // 27px - 6px below bottom edge of ctrlbar

export const getRowsFromHeight = (height) => {
    return Math.round(
        (height - SHOWMORE_BUTTON_HEIGHT - PADDING_TOP) / ROW_HEIGHT
    )
}
