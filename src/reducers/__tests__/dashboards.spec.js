import reducer, { actionTypes, DEFAULT_DASHBOARDS } from '../dashboards';

describe('dashboards reducer', () => {
    const currentBoards = {
        dash1: {
            id: 'dash1',
            name: 'good stuff',
            displayName: 'untranslated',
            starred: false,
        },
    };

    const boards = {
        dash2: {
            id: 'dash2',
            name: 'ok stuff',
        },
    };

    const currentItems = [
        {
            id: 'item1',
            type: 'CHART',
        },
    ];

    const items = [
        {
            id: 'item2',
            type: 'MAP',
        },
    ];

    const currentState = {
        byId: currentBoards,
        items: currentItems,
    };

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' });

        expect(actualState).toEqual(DEFAULT_DASHBOARDS);
    });

    it('SET_DASHBOARDS: should set the new list of dashboards and clear the items array', () => {
        const actualState = reducer(currentState, {
            type: actionTypes.SET_DASHBOARDS,
            value: boards,
        });

        const expectedState = {
            byId: boards,
            items: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it('APPEND_DASHBOARDS: should append to the list of dashboards and leave the items untouched', () => {
        const actualState = reducer(currentState, {
            type: actionTypes.APPEND_DASHBOARDS,
            value: boards,
        });

        const expectedState = {
            ...currentState,
            byId: {
                ...currentState.byId,
                ...boards,
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it('SET_DASHBOARD_STARRED: should set "starred" on a dashboard', () => {
        const actualState = reducer(currentState, {
            type: actionTypes.SET_DASHBOARD_STARRED,
            dashboardId: 'dash1',
            value: true,
        });

        const expectedState = {
            ...currentState,
            byId: {
                dash1: {
                    ...currentBoards.dash1,
                    starred: true,
                },
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it('SET_DASHBOARD_STARRED: should set "displayName" on a dashboard', () => {
        const displayName = 'nome tradotto';

        const actualState = reducer(currentState, {
            type: actionTypes.SET_DASHBOARD_DISPLAY_NAME,
            dashboardId: 'dash1',
            value: displayName,
        });

        const expectedState = {
            ...currentState,
            byId: {
                dash1: {
                    ...currentBoards.dash1,
                    displayName: displayName,
                },
            },
        };

        expect(actualState).toEqual(expectedState);
    });

    it('SET_DASHBOARD_ITEMS: should set the new list of dashboard items', () => {
        const actualState = reducer(currentState, {
            type: actionTypes.SET_DASHBOARD_ITEMS,
            value: items,
        });

        const expectedState = {
            ...currentState,
            items,
        };

        expect(actualState).toEqual(expectedState);
    });
});
