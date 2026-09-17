// Shared hand-off between the add action and the canvas grid. Clicking an item
// in the Build sidebar appends it at the top or bottom of the canvas, which may
// be outside the current viewport — so the action stashes the new item's id
// here and the grid scrolls it into view once react-grid-layout has placed it.

let pendingScrollItemId = null

export const setPendingScrollItem = (id) => {
    pendingScrollItemId = id
}

export const getPendingScrollItem = () => pendingScrollItemId

export const clearPendingScrollItem = () => {
    pendingScrollItemId = null
}
