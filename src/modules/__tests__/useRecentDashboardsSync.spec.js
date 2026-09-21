import { useDataEngine } from '@dhis2/app-runtime'
import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import {
    apiGetRecentDashboards,
    apiPostRecentDashboards,
} from '../../api/recentDashboards.js'
import { SET_RECENT_DASHBOARDS } from '../../reducers/recentDashboards.js'
import {
    getStoredRecentEntries,
    hasPendingFlush,
    markFlushed,
    storeRecentEntries,
} from '../recentDashboards.js'
import { useRecentDashboardsSync } from '../useRecentDashboardsSync.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDataEngine: jest.fn(),
}))

jest.mock('../../api/recentDashboards.js', () => ({
    apiGetRecentDashboards: jest.fn(),
    apiPostRecentDashboards: jest.fn(),
}))

const username = 'rainbowDash'
const mockEngine = {}
const mockStore = configureMockStore()

const renderSyncHook = (store) =>
    renderHook(() => useRecentDashboardsSync(username), {
        wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
        ),
    })

describe('useRecentDashboardsSync', () => {
    beforeEach(() => {
        localStorage.clear()
        jest.clearAllMocks()
        useDataEngine.mockReturnValue(mockEngine)
    })

    it('a failed read does not overwrite the local cache', async () => {
        storeRecentEntries(username, [{ id: 'a', lastOpened: 100 }])
        // lastFlushed >= lastOpened, so there is nothing pending and the
        // mount effect takes the pull path instead of the push path.
        markFlushed(username, 200)
        apiGetRecentDashboards.mockResolvedValue(null)

        const store = mockStore({})
        const { unmount } = renderSyncHook(store)

        await waitFor(() => {
            expect(apiGetRecentDashboards).toHaveBeenCalled()
        })

        expect(apiPostRecentDashboards).not.toHaveBeenCalled()
        expect(getStoredRecentEntries(username)).toEqual([
            { id: 'a', lastOpened: 100 },
        ])
        expect(store.getActions()).toEqual([
            { type: SET_RECENT_DASHBOARDS, value: ['a'] },
        ])

        unmount()
    })

    it('a failed write leaves the pending signal intact', async () => {
        // lastFlushed defaults to 0, so this entry is pending.
        storeRecentEntries(username, [{ id: 'a', lastOpened: 100 }])
        apiPostRecentDashboards.mockResolvedValue(false)

        const store = mockStore({})
        const { unmount } = renderSyncHook(store)

        await waitFor(() => {
            expect(apiPostRecentDashboards).toHaveBeenCalled()
        })

        expect(hasPendingFlush(username)).toBe(true)

        unmount()
    })
})
