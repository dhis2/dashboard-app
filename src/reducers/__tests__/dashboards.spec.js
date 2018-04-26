import reducer, { actionTypes, DEFAULT_DASHBOARDS } from '../dashboards';

const testState = {
    byId: {
        dash1: {
            id: 'dash1',
            name: 'good stuff',
            displayName: 'untranslated',
            starred: false,
        },
        dash2: {
            id: 'dash2',
            name: 'decent stuff',
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
    dash3: {
        id: 'dash3',
        name: 'ok stuff',
    },
};

describe('dashboards reducer', () => {
    // const currentBoards = {
    //     dash1: {
    //         id: 'dash1',
    //         name: 'good stuff',
    //         displayName: 'untranslated',
    //         starred: false,
    //     },
    // };

    // const boards = {
    //     dash2: {
    //         id: 'dash2',
    //         name: 'ok stuff',
    //     },
    // };

    // const currentItems = [
    //     {
    //         id: 'item1',
    //         type: 'CHART',
    //     },
    // ];

    // const items = [
    //     {
    //         id: 'item2',
    //         type: 'MAP',
    //     },
    // ];

    // const currentState = {
    //     byId: currentBoards,
    //     items: currentItems,
    // };

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' });

        expect(actualState).toEqual(DEFAULT_DASHBOARDS);
    });

    it('SET_DASHBOARDS: should set the new list of dashboards and clear the items array', () => {
        const actualState = reducer(testState, {
            type: actionTypes.SET_DASHBOARDS,
            value: dashboards,
        });

        const expectedState = {
            byId: dashboards,
            items: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it('APPEND_DASHBOARDS: should append to the list of dashboards and leave the items untouched', () => {
        const actualState = reducer(testState, {
            type: actionTypes.APPEND_DASHBOARDS,
            value: dashboards,
        });

        const expectedState = {
            ...testState,
            byId: {
                ...testState.byId,
                ...dashboards,
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it('SET_DASHBOARD_STARRED: should set "starred" on a dashboard', () => {
        const id = 'dash1';
        const starredValue = true;

        const actualState = reducer(testState, {
            type: actionTypes.SET_DASHBOARD_STARRED,
            dashboardId: id,
            value: starredValue,
        });

        const expectedState = {
            ...testState,
        };

        expectedState.byId[id].starred = starredValue;

        expect(actualState).toEqual(expectedState);
    });

    it('SET_DASHBOARD_DISPLAYNAME: should set "displayName" on a dashboard', () => {
        const id = 'dash1';
        const displayName = 'nome tradotto';

        const actualState = reducer(testState, {
            type: actionTypes.SET_DASHBOARD_DISPLAY_NAME,
            dashboardId: id,
            value: displayName,
        });

        const expectedState = {
            ...testState,
        };

        expectedState.byId[id].displayName = displayName;

        expect(actualState).toEqual(expectedState);
    });

    it('SET_DASHBOARD_ITEMS: should set the new list of dashboard items', () => {
        const items = [{ id: 'item2', type: 'CHART' }];

        const actualState = reducer(testState, {
            type: actionTypes.SET_DASHBOARD_ITEMS,
            value: items,
        });

        const expectedState = {
            ...testState,
            items,
        };

        expect(actualState).toEqual(expectedState);
    });
});
