import { TEXT } from '../modules/itemTypes.js'
import {
    CLEAR_PRINT_PREVIEW_VIEW,
    RECEIVED_DASHBOARD_ITEM_SHAPES,
    RECEIVED_EDIT_DASHBOARD,
    RECEIVED_HIDE_GRID,
    RECEIVED_CODE,
    RECEIVED_DESCRIPTION,
    RECEIVED_NOT_EDITING,
    RECEIVED_TITLE,
    SET_NEW_ITEM_SIZE,
    SET_PRINT_PREVIEW_VIEW,
    START_NEW_DASHBOARD,
    UPDATE_DASHBOARD_ITEM,
} from './editDashboard.js'

// Undo / redo for the dashboard editor. Wraps the root reducer and keeps
// snapshots of the `editDashboard` slice (its updates are immutable, so a
// snapshot is just the previous object).

export const UNDO_EDIT = 'UNDO_EDIT'
export const REDO_EDIT = 'REDO_EDIT'

export const acUndoEdit = () => ({ type: UNDO_EDIT })
export const acRedoEdit = () => ({ type: REDO_EDIT })

const MAX_STEPS = 50
// One action's burst of dispatches (e.g. add item + re-flow) is one step
const BURST_MS = 60
// Typing in the same field is one step while keystrokes are this close
const TYPING_MS = 1000

export const EMPTY_HISTORY = {
    past: [],
    future: [],
    saved: null,
    lastKey: null,
    lastTime: 0,
}

// View state and editor preferences aren't edits
const NOT_RECORDED = new Set([
    SET_PRINT_PREVIEW_VIEW,
    CLEAR_PRINT_PREVIEW_VIEW,
    RECEIVED_HIDE_GRID,
    SET_NEW_ITEM_SIZE,
])

// A new dashboard in the editor starts a fresh history
const RESETS = new Set([
    RECEIVED_EDIT_DASHBOARD,
    START_NEW_DASHBOARD,
    RECEIVED_NOT_EDITING,
])

const isRecorded = (action) =>
    !NOT_RECORDED.has(action.type) &&
    // grid compaction (on load, resize, after undo) isn't a user edit
    !(
        action.type === RECEIVED_DASHBOARD_ITEM_SHAPES &&
        action.meta?.history === false
    )

// Only typing groups; moves, resizes, adds, deletes etc. are always own steps
const TYPING_ACTIONS = new Set([
    RECEIVED_TITLE,
    RECEIVED_CODE,
    RECEIVED_DESCRIPTION,
])
const isTyping = (action) =>
    TYPING_ACTIONS.has(action.type) ||
    (action.type === UPDATE_DASHBOARD_ITEM && action.value?.type === TEXT)

const typingKey = (action) =>
    isTyping(action) ? `${action.type}:${action.value?.id ?? ''}` : null

// Restoring keeps the current view state; dirty means "differs from saved"
const restore = (snapshot, current, saved) => ({
    ...snapshot,
    printPreviewView: current.printPreviewView,
    isDirty: snapshot !== saved,
})

export const withEditHistory = (reducer) => (state, action) => {
    const history = state?.editHistory || EMPTY_HISTORY
    const current = state?.editDashboard

    if (action.type === UNDO_EDIT || action.type === REDO_EDIT) {
        const isUndo = action.type === UNDO_EDIT
        const from = isUndo ? history.past : history.future
        if (!from.length) {
            return state
        }
        const target = from[from.length - 1]
        return {
            ...state,
            editDashboard: restore(target, current, history.saved),
            editHistory: {
                ...history,
                past: isUndo
                    ? history.past.slice(0, -1)
                    : [...history.past, current],
                future: isUndo
                    ? [...history.future, current]
                    : history.future.slice(0, -1),
                lastKey: null,
            },
        }
    }

    const next = reducer(state, action)

    if (RESETS.has(action.type)) {
        return {
            ...next,
            editHistory: { ...EMPTY_HISTORY, saved: next.editDashboard },
        }
    }

    if (next.editDashboard === current || !isRecorded(action)) {
        return next
    }

    // shortcut: Date.now() keeps the reducer impure; fine for the prototype,
    // move timing into action meta if this ships
    const now = Date.now()
    const key = typingKey(action)
    const merge =
        now - history.lastTime < BURST_MS ||
        (key !== null &&
            key === history.lastKey &&
            now - history.lastTime < TYPING_MS)

    return {
        ...next,
        editHistory: {
            ...history,
            past: merge
                ? history.past
                : [...history.past, current].slice(-MAX_STEPS),
            future: [],
            lastKey: key,
            lastTime: now,
        },
    }
}

export const sGetCanUndo = (state) => state.editHistory.past.length > 0
export const sGetCanRedo = (state) => state.editHistory.future.length > 0
