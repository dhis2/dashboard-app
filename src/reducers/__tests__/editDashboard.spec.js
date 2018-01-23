import reducer, { actionTypes } from '../editDashboard';

describe('editDashboard reducer', () => {
    const initialState = {
        id: 'ponydash',
        name: 'My pony dashboard',
        description: 'My pony dashboard description',
        dashboardItems: [
            { id: 'int0', type: 'FLUTTERSHY' },
            { id: 'int1', type: 'RARITY' },
        ],
    };

    const newState = {
        id: 'scarydash',
        name: 'My scary dashboard',
        dashboardItems: [
            { id: 'd5', type: 'GHOST' },
            { id: 'd6', type: 'GHOUL' },
            { id: 'd7', type: 'POLTERGEIST' },
        ],
    };

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' });

        expect(actualState).toEqual({});
    });

    it('should set the dashboard to be edited', () => {
        const actualState = reducer(initialState, {
            type: actionTypes.RECEIVED_EDIT_DASHBOARD,
            value: newState,
        });

        expect(actualState.name).toEqual(newState.name);
        expect(actualState.id).toEqual(newState.id);
        expect(actualState.dashboardItems.length).toEqual(
            newState.dashboardItems.length
        );
    });

    it('should set the dashboard title', () => {
        const title = 'moohaha scary dashboard';

        const actualState = reducer(initialState, {
            type: actionTypes.RECEIVED_TITLE,
            value: title,
        });

        expect(actualState.name).toEqual(title);
        expect(actualState.dashboardItems.length).toEqual(
            initialState.dashboardItems.length
        );

        expect(initialState.name).toEqual('My pony dashboard');
    });

    it('should set the dashboard description', () => {
        const description = 'moohaha scary dashboard dashboard';

        const actualState = reducer(initialState, {
            type: actionTypes.RECEIVED_DESCRIPTION,
            value: description,
        });

        expect(actualState.description).toEqual(description);
        expect(actualState.dashboardItems.length).toEqual(
            initialState.dashboardItems.length
        );

        expect(initialState.description).toEqual(
            'My pony dashboard description'
        );
    });

    it('should be a pure function', () => {
        reducer(initialState, {
            type: actionTypes.RECEIVED_EDIT_DASHBOARD,
            value: newState,
        });

        // run the reducer again
        reducer(initialState, {
            type: actionTypes.RECEIVED_EDIT_DASHBOARD,
            value: newState,
        });

        expect(initialState.id).toEqual('ponydash');
        expect(initialState.dashboardItems.length).toEqual(2);
    });
});
