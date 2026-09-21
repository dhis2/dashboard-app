import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { apiFetchDashboard } from '../../api/fetchDashboard.js'
import { SET_RECENT_DASHBOARDS } from '../../reducers/recentDashboards.js'
import {
    tSetSelectedDashboardById,
    tSetSelectedDashboardByIdOffline,
} from '../selected.js'

jest.mock('../../api/fetchDashboard.js')

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const username = 'rainbowDash'
const initialState = { selected: {} }

const recordsRecentDashboard = (actions) =>
    actions.some((action) => action.type === SET_RECENT_DASHBOARDS)

describe('tSetSelectedDashboardById', () => {
    beforeEach(() => {
        localStorage.clear()
        apiFetchDashboard.mockResolvedValue({
            id: 'a',
            displayName: 'A',
            starred: false,
            dashboardItems: [],
        })
    })

    it('dispatches SET_RECENT_DASHBOARDS when recordRecent is true', async () => {
        const store = mockStore(initialState)

        await store.dispatch(tSetSelectedDashboardById('a', username, true))

        expect(recordsRecentDashboard(store.getActions())).toBe(true)
    })

    it('does not dispatch SET_RECENT_DASHBOARDS when recordRecent is omitted', async () => {
        const store = mockStore(initialState)

        await store.dispatch(tSetSelectedDashboardById('a', username))

        expect(recordsRecentDashboard(store.getActions())).toBe(false)
    })
})

describe('tSetSelectedDashboardByIdOffline', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('dispatches SET_RECENT_DASHBOARDS when recordRecent is true', () => {
        const store = mockStore(initialState)

        store.dispatch(tSetSelectedDashboardByIdOffline('a', username, true))

        expect(recordsRecentDashboard(store.getActions())).toBe(true)
    })

    it('does not dispatch SET_RECENT_DASHBOARDS when recordRecent is omitted', () => {
        const store = mockStore(initialState)

        store.dispatch(tSetSelectedDashboardByIdOffline('a', username))

        expect(recordsRecentDashboard(store.getActions())).toBe(false)
    })
})
