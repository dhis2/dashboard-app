import { SHOWMORE_BAR_HEIGHT } from './ShowMoreButton'
import { DRAG_HANDLE_HEIGHT } from './ControlBar'

export const CONTROL_BAR_ROW_HEIGHT = 40
export const FIRST_ROW_PADDING_HEIGHT = 10
export const MIN_ROW_COUNT = 1
export const HEADERBAR_HEIGHT = 48
export const CONTROL_BAR_MARGIN_BOTTOM_SMALL = 32
export const SEARCH_BAR_HEIGHT_SMALL = 40 // height (24px) + padding top and bottom (8px)

// show more button
export const CONTROL_BAR_OUTER_HEIGHT_DIFF =
    FIRST_ROW_PADDING_HEIGHT + SHOWMORE_BAR_HEIGHT - 2 // 2 pixel "adjustment"

export const getRowsHeight = rows => {
    return rows * CONTROL_BAR_ROW_HEIGHT
}

export const getNumRowsFromHeight = height => {
    return Math.floor(
        (height - CONTROL_BAR_OUTER_HEIGHT_DIFF) / CONTROL_BAR_ROW_HEIGHT
    )
}

export const getControlBarHeight = rows => {
    return getRowsHeight(rows) + CONTROL_BAR_OUTER_HEIGHT_DIFF
}

export const CONTROL_BAR = 'controlBar'
export const CONTROL_BAR_CONTAINER = 'controlBarContainer'
export const CHIPS_CONTAINER = 'chipsContainer'
export const CONTROL_BAR_COLLAPSED = 'controlBarCollapsed'

export const getControlBarHeightSmallDevice = (type, height) => {
    const controlBarHeight =
        height - HEADERBAR_HEIGHT - CONTROL_BAR_MARGIN_BOTTOM_SMALL

    switch (type) {
        // control bar height should be 100vh -32px
        case CONTROL_BAR:
            return controlBarHeight - DRAG_HANDLE_HEIGHT
        case CONTROL_BAR_CONTAINER:
            return controlBarHeight - CONTROL_BAR_OUTER_HEIGHT_DIFF
        case CHIPS_CONTAINER:
            return (
                controlBarHeight -
                SEARCH_BAR_HEIGHT_SMALL -
                CONTROL_BAR_OUTER_HEIGHT_DIFF
            )
        case CONTROL_BAR_COLLAPSED:
        default:
            return (
                SEARCH_BAR_HEIGHT_SMALL +
                CONTROL_BAR_OUTER_HEIGHT_DIFF +
                DRAG_HANDLE_HEIGHT
            )
    }
}
