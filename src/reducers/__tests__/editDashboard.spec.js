import update from 'immutability-helper';
import reducer, { actionTypes } from '../editDashboard';

describe('editDashboard reducer', () => {
    const initialState = {
        id: 'ponydash',
        name: 'My pony dashboard',
        description: 'My pony dashboard description',
        dashboardItems: [
            {
                id: 'd0',
                type: 'FLUTTERSHY',
                w: 4,
                h: 4,
                x: 4,
                y: 4,
                shape: 'elegant',
            },
            {
                id: 'd1',
                type: 'RARITY',
                w: 4,
                h: 4,
                x: 4,
                y: 4,
                shape: 'sloppy',
            },
        ],
    };

    it('should set the dashboard layout', () => {
        const shape0 = { w: 7, h: 7, x: 7, y: 7 };
        const shape1 = { w: 9, h: 9, x: 9, y: 9 };
        const newLayout = [
            Object.assign({}, { i: 'd0' }, shape0),
            Object.assign({}, { i: 'd1' }, shape1),
        ];

        const actualState = reducer(initialState, {
            type: actionTypes.RECEIVED_DASHBOARD_LAYOUT,
            value: newLayout,
        });

        expect(actualState.id).toEqual('ponydash');
        expect(actualState.name).toEqual('My pony dashboard');

        const expectedItem = update(initialState.dashboardItems[0], {
            $merge: shape0,
        });

        expect(actualState.dashboardItems[0]).toMatchObject(expectedItem);

        //check for pure function
        expect(initialState.dashboardItems[0].w).toEqual(4);
    });

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

        //check for pure function
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

        //check for pure function
        expect(initialState.description).toEqual(
            'My pony dashboard description'
        );
    });

    it('should add a dashboard item', () => {
        const newItem = {
            id: 'add1',
            type: 'ROBOT',
        };

        const actualState = reducer(initialState, {
            type: actionTypes.ADD_DASHBOARD_ITEM,
            value: newItem,
        });

        expect(actualState.dashboardItems.length).toEqual(
            initialState.dashboardItems.length + 1
        );

        const expectedState = update(initialState, {
            dashboardItems: { $push: [newItem] },
        });

        expect(actualState).toMatchObject(expectedState);

        //check for pure function
        expect(initialState.dashboardItems.length).toEqual(2);
    });

    it('should remove a dashboard item', () => {
        const removeIdx = 1;
        const itemToRemove = initialState.dashboardItems[removeIdx];

        const actualState = reducer(initialState, {
            type: actionTypes.REMOVE_DASHBOARD_ITEM,
            value: itemToRemove.id,
        });

        expect(actualState.dashboardItems.length).toEqual(
            initialState.dashboardItems.length - 1
        );

        const expectedState = update(initialState, {
            dashboardItems: { $splice: [[removeIdx, 1]] },
        });

        expect(actualState).toMatchObject(expectedState);

        //check for pure function
        expect(initialState.dashboardItems.length).toEqual(2);
    });
});
