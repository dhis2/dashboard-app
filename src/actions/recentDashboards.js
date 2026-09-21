import {
    addRecentEntry,
    getIdsFromEntries,
    getStoredRecentEntries,
    removeRecentEntry,
    storeRecentEntries,
} from '../modules/recentDashboards.js'
import { SET_RECENT_DASHBOARDS } from '../reducers/recentDashboards.js'

export const acSetRecentDashboards = (ids) => ({
    type: SET_RECENT_DASHBOARDS,
    value: ids,
})

export const tRecordDashboardOpened =
    (username, id, now = Date.now()) =>
    (dispatch) => {
        const entries = addRecentEntry(
            getStoredRecentEntries(username),
            id,
            now
        )

        storeRecentEntries(username, entries)

        return dispatch(acSetRecentDashboards(getIdsFromEntries(entries)))
    }

export const tRemoveRecentDashboard = (username, id) => (dispatch) => {
    const entries = removeRecentEntry(getStoredRecentEntries(username), id)

    storeRecentEntries(username, entries)

    return dispatch(acSetRecentDashboards(getIdsFromEntries(entries)))
}
