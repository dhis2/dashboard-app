import reducer, {
    DEFAULT_STATE_DASHBOARDS,
    sGetDashboardsRoot,
    sGetDashboardById,
    sGetAllDashboards,
    sGetStarredDashboards,
    sGetUnstarredDashboards,
    sGetStarredDashboardIds,
    sGetUnstarredDashboardIds,
    sGetDashboardsSortedByStarred,
    SET_DASHBOARDS,
    ADD_DASHBOARDS,
    SET_DASHBOARD_STARRED,
    SET_DASHBOARD_DISPLAY_NAME,
    SET_DASHBOARD_ITEMS,
} from '../dashboards';

const dashId1 = 'dash1';
const dashId2 = 'dash2';
const dashId3 = 'dash3';
const dashId4 = 'dash4';

const dashboardsState = {
    byId: {
        [dashId1]: {
            id: dashId1,
            name: 'an unstarred dashboard',
            displayName: 'una cruscotto non stellato',
            starred: false,
        },
        [dashId2]: {
            id: dashId2,
            name: 'a starred dashboard',
            displayName: 'una cruscotto con stelle',
            starred: true,
        },
        [dashId3]: {
            id: dashId3,
            name: 'unstarred dashboard',
            displayName: 'cruscotto non stellato',
            starred: false,
        },
        [dashId4]: {
            id: dashId4,
            name: 'starred dashboard',
            displayName: 'cruscotto con stelle',
            starred: true,
        },
    },
    items: [
        {
            id: 'item1',
            type: 'REPORT_TABLE',
        },
    ],
};

const dashboards = {
    someDash: {
        id: 'someDash',
        name: 'good stuff',
        displayName: 'roba buona',
        starred: false,
    },
};

describe('dashboards reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' });

        expect(actualState).toEqual(DEFAULT_STATE_DASHBOARDS);
    });

    it('SET_DASHBOARDS: should set the new list of dashboards and clear the items array', () => {
        const actualState = reducer(dashboardsState, {
            type: SET_DASHBOARDS,
            value: dashboards,
        });

        const expectedState = {
            byId: dashboards,
            items: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it('ADD_DASHBOARDS: should append to the list of dashboards and leave the items untouched', () => {
        const actualState = reducer(dashboardsState, {
            type: ADD_DASHBOARDS,
            value: dashboards,
        });

        const expectedState = {
            ...dashboardsState,
            byId: {
                ...dashboardsState.byId,
                ...dashboards,
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it('SET_DASHBOARD_STARRED: should set "starred" on a dashboard', () => {
        const starredValue = true;

        const actualState = reducer(dashboardsState, {
            type: SET_DASHBOARD_STARRED,
            dashboardId: dashId1,
            value: starredValue,
        });

        const expectedState = {
            ...dashboardsState,
            byId: {
                ...dashboardsState.byId,
                [dashId1]: {
                    ...dashboardsState.byId[dashId1],
                    starred: starredValue,
                },
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it('SET_DASHBOARD_DISPLAYNAME: should set "displayName" on a dashboard', () => {
        const displayName = 'nome tradotto';

        const actualState = reducer(dashboardsState, {
            type: SET_DASHBOARD_DISPLAY_NAME,
            dashboardId: dashId1,
            value: displayName,
        });

        const expectedState = {
            ...dashboardsState,
            byId: {
                ...dashboardsState.byId,
                [dashId1]: {
                    ...dashboardsState.byId[dashId1],
                    displayName: displayName,
                },
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it('SET_DASHBOARD_ITEMS: should set the new list of dashboard items', () => {
        const items = [{ id: 'item2', type: 'CHART' }];

        const actualState = reducer(dashboardsState, {
            type: SET_DASHBOARD_ITEMS,
            value: items,
        });

        const expectedState = {
            ...dashboardsState,
            items,
        };

        expect(actualState).toEqual(expectedState);
    });
});

const testState = {
    dashboards: dashboardsState,
};

const dash1 = dashboardsState.byId[dashId1];
const dash2 = dashboardsState.byId[dashId2];
const dash3 = dashboardsState.byId[dashId3];
const dash4 = dashboardsState.byId[dashId4];

describe('dashboards selectors', () => {
    it('sGetDashboardsRoot: should return the root prop', () => {
        const actualState = sGetDashboardsRoot(testState);

        expect(actualState).toEqual(dashboardsState);
    });

    it('sGetDashboardById: should return dashboard with the provided id', () => {
        const actualState = sGetDashboardById(testState, dashId1);

        expect(actualState).toEqual(dashboardsState.byId[dashId1]);
    });

    it('sGetDashboardById: should return undefined', () => {
        const actualState = sGetDashboardById(testState, 'NO_MATCH');

        expect(actualState).toEqual(undefined);
    });

    it('sGetAllDashboards: should return an object with all dashboards', () => {
        const actualState = sGetAllDashboards(testState);

        expect(actualState).toEqual(dashboardsState.byId);
    });

    it('sGetStarredDashboards: should return an array of starred dashboards', () => {
        const actualState = sGetStarredDashboards(testState);

        expect(actualState).toEqual([dash2, dash4]);
    });

    it('sGetUnstarredDashboards: should return an array of unstarred dashboards', () => {
        const actualState = sGetUnstarredDashboards(testState);

        expect(actualState).toEqual([dash1, dash3]);
    });

    it('sGetStarredDashboardIds: should return an array of starred dashboard ids', () => {
        const actualState = sGetStarredDashboardIds(testState);

        expect(actualState).toEqual([dashId2, dashId4]);
    });

    it('sGetUnstarredDashboardIds: should return an array of unstarred dashboard ids', () => {
        const actualState = sGetUnstarredDashboardIds(testState);

        expect(actualState).toEqual([dashId1, dashId3]);
    });

    it('sGetDashboardsSortedByStarred: should return an array of dashboards sorted by starred/displayName-asc, then unstarred/displayName-asc', () => {
        const actualState = sGetDashboardsSortedByStarred(testState);

        expect(actualState).toEqual([dash4, dash2, dash3, dash1]);
    });
});
