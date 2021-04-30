import reducer, {
    DEFAULT_STATE_DASHBOARDS,
    sGetDashboardsRoot,
    sGetDashboardById,
    sGetAllDashboards,
    sGetDashboardsSortedByStarred,
    SET_DASHBOARDS,
    ADD_DASHBOARDS,
    SET_DASHBOARD_STARRED,
} from '../dashboards'

const dashId1 = 'dash1'
const dashId2 = 'dash2'
const dashId3 = 'dash3'
const dashId4 = 'dash4'

const dashboardsState = {
    byId: {
        [dashId1]: {
            id: dashId1,
            displayName: 'una cruscotto non stellato',
            starred: false,
        },
        [dashId2]: {
            id: dashId2,
            displayName: 'una cruscotto con stelle',
            starred: true,
        },
        [dashId3]: {
            id: dashId3,
            displayName: 'cruscotto non stellato',
            starred: false,
        },
        [dashId4]: {
            id: dashId4,
            displayName: 'cruscotto con stelle',
            starred: true,
        },
    },
}

const dashboards = {
    someDash: {
        id: 'someDash',
        displayName: 'roba buona',
        starred: false,
    },
}

describe('dashboards reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' })

        expect(actualState).toEqual(DEFAULT_STATE_DASHBOARDS)
    })

    it('SET_DASHBOARDS: should set the new list of dashboards', () => {
        const actualState = reducer(dashboardsState, {
            type: SET_DASHBOARDS,
            value: dashboards,
        })

        const expectedState = {
            byId: dashboards,
        }

        expect(actualState).toEqual(expectedState)
    })

    it('ADD_DASHBOARDS: should append to the list of dashboards', () => {
        const actualState = reducer(dashboardsState, {
            type: ADD_DASHBOARDS,
            value: dashboards,
        })

        const expectedState = {
            ...dashboardsState,
            byId: {
                ...dashboardsState.byId,
                ...dashboards,
            },
        }

        expect(actualState).toEqual(expectedState)
    })

    it('SET_DASHBOARD_STARRED: should set "starred" on a dashboard', () => {
        const starredValue = true

        const actualState = reducer(dashboardsState, {
            type: SET_DASHBOARD_STARRED,
            dashboardId: dashId1,
            value: starredValue,
        })

        const expectedState = {
            ...dashboardsState,
            byId: {
                ...dashboardsState.byId,
                [dashId1]: {
                    ...dashboardsState.byId[dashId1],
                    starred: starredValue,
                },
            },
        }

        expect(actualState).toEqual(expectedState)
    })
})

const testState = {
    dashboards: dashboardsState,
}

const dash1 = dashboardsState.byId[dashId1]
const dash2 = dashboardsState.byId[dashId2]
const dash3 = dashboardsState.byId[dashId3]
const dash4 = dashboardsState.byId[dashId4]

describe('dashboards selectors', () => {
    it('sGetDashboardsRoot: should return the root prop', () => {
        const actualState = sGetDashboardsRoot(testState)

        expect(actualState).toEqual(dashboardsState)
    })

    it('sGetDashboardById: should return dashboard with the provided id', () => {
        const actualState = sGetDashboardById(testState, dashId1)

        expect(actualState).toEqual(dashboardsState.byId[dashId1])
    })

    it('sGetDashboardById: should return undefined', () => {
        const actualState = sGetDashboardById(testState, 'NO_MATCH')

        expect(actualState).toEqual(undefined)
    })

    it('sGetAllDashboards: should return an object with all dashboards', () => {
        const actualState = sGetAllDashboards(testState)

        expect(actualState).toEqual(dashboardsState.byId)
    })

    it('sGetDashboardsSortedByStarred: should return an array of dashboards sorted by starred/displayName-asc, then unstarred/displayName-asc', () => {
        const actualState = sGetDashboardsSortedByStarred(testState)

        expect(actualState).toEqual([dash4, dash2, dash3, dash1])
    })
})
