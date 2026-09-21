import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
    getStoredRecentEntries,
    hasPendingFlush,
    markFlushed,
    storeRecentEntries,
} from '../../modules/recentDashboards.js'
import { SET_RECENT_DASHBOARDS } from '../../reducers/recentDashboards.js'
import {
    tRecordDashboardOpened,
    tRemoveRecentDashboard,
} from '../recentDashboards.js'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const username = 'rainbowDash'

describe('recent dashboards thunks', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('tRecordDashboardOpened writes the entry to localStorage and dispatches the updated ids', () => {
        const now = 1700000000000
        const store = mockStore({})

        store.dispatch(tRecordDashboardOpened(username, 'a', now))

        expect(store.getActions()).toEqual([
            { type: SET_RECENT_DASHBOARDS, value: ['a'] },
        ])
        expect(getStoredRecentEntries(username)).toEqual([
            { id: 'a', lastOpened: now },
        ])
    })

    it('tRemoveRecentDashboard removes the entry from localStorage and dispatches the updated ids', () => {
        storeRecentEntries(username, [
            { id: 'a', lastOpened: 1 },
            { id: 'b', lastOpened: 2 },
        ])
        const store = mockStore({})

        store.dispatch(tRemoveRecentDashboard(username, 'a'))

        expect(store.getActions()).toEqual([
            { type: SET_RECENT_DASHBOARDS, value: ['b'] },
        ])
        expect(getStoredRecentEntries(username)).toEqual([
            { id: 'b', lastOpened: 2 },
        ])
    })

    it('tRemoveRecentDashboard leaves a pending flush even though it only shrinks the list', () => {
        storeRecentEntries(username, [
            { id: 'a', lastOpened: 1 },
            { id: 'b', lastOpened: 2 },
        ])
        markFlushed(username, 1000)
        const store = mockStore({})

        store.dispatch(tRemoveRecentDashboard(username, 'a'))

        expect(hasPendingFlush(username)).toBe(true)
    })
})
