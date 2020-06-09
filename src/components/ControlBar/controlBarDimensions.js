import { SHOWMORE_BAR_HEIGHT } from './ShowMoreButton'

export const CONTROL_BAR_ROW_HEIGHT = 40
export const FIRST_ROW_PADDING_HEIGHT = 10
export const MIN_ROW_COUNT = 1

export const HEADERBAR_HEIGHT = 48

const CONTROL_BAR_OUTER_HEIGHT_DIFF =
    FIRST_ROW_PADDING_HEIGHT + SHOWMORE_BAR_HEIGHT - 2 // 2 pixel "adjustment"

export const getRowsHeight = rows => {
    return rows * CONTROL_BAR_ROW_HEIGHT
}

export const getNumRowsFromHeight = height => {
    return Math.floor(
        (height - CONTROL_BAR_OUTER_HEIGHT_DIFF) / CONTROL_BAR_ROW_HEIGHT
    )
}

export const getTopOffset = rows => {
    return HEADERBAR_HEIGHT + getControlBarHeight(rows, false)
}

export const getControlBarHeight = rows => {
    return getRowsHeight(rows) + CONTROL_BAR_OUTER_HEIGHT_DIFF
}
