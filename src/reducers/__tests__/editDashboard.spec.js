import update from 'immutability-helper';
import reducer, {
    DEFAULT_STATE_EDIT_DASHBOARD,
    NEW_DASHBOARD_STATE,
    sGetIsEditing,
    RECEIVED_DASHBOARD_LAYOUT,
    RECEIVED_NOT_EDITING,
    START_NEW_DASHBOARD,
    RECEIVED_EDIT_DASHBOARD,
    RECEIVED_TITLE,
    RECEIVED_DESCRIPTION,
    ADD_DASHBOARD_ITEM,
    UPDATE_DASHBOARD_ITEM,
    REMOVE_DASHBOARD_ITEM,
} from '../editDashboard';

describe('editDashboard', () => {
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

    describe('reducer', () => {
        it('should set the dashboard layout', () => {
            const shape0 = { w: 7, h: 7, x: 7, y: 7 };
            const shape1 = { w: 9, h: 9, x: 9, y: 9 };
            const newLayout = [
                Object.assign({}, { i: 'd0' }, shape0),
                Object.assign({}, { i: 'd1' }, shape1),
            ];

            const actualState = reducer(initialState, {
                type: RECEIVED_DASHBOARD_LAYOUT,
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
            displayName: 'La mia dashboard da paura',
            dashboardItems: [
                { id: 'd5', type: 'GHOST' },
                { id: 'd6', type: 'GHOUL' },
                { id: 'd7', type: 'POLTERGEIST' },
            ],
        };

        it('should return the default state', () => {
            const actualState = reducer(undefined, {});

            expect(actualState).toEqual(DEFAULT_STATE_EDIT_DASHBOARD);
        });

        it('should handle the action RECEIVED_NOT_EDITING', () => {
            const actualState = reducer(initialState, {
                type: RECEIVED_NOT_EDITING,
            });

            expect(actualState).toEqual(DEFAULT_STATE_EDIT_DASHBOARD);
        });

        it('should return the state for a new dashboard', () => {
            const actualState = reducer(DEFAULT_STATE_EDIT_DASHBOARD, {
                type: START_NEW_DASHBOARD,
            });

            expect(actualState).toEqual(NEW_DASHBOARD_STATE);
        });

        it('should set the dashboard to be edited', () => {
            const actualState = reducer(initialState, {
                type: RECEIVED_EDIT_DASHBOARD,
                value: newState,
            });

            expect(actualState.displayName).toEqual();
            expect(actualState.name).toEqual(newState.name);
            expect(actualState.id).toEqual(newState.id);
            expect(actualState.dashboardItems.length).toEqual(
                newState.dashboardItems.length
            );
        });

        it('should set the dashboard title', () => {
            const title = 'moohaha scary dashboard';

            const actualState = reducer(initialState, {
                type: RECEIVED_TITLE,
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
                type: RECEIVED_DESCRIPTION,
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
                type: ADD_DASHBOARD_ITEM,
                value: newItem,
            });

            expect(actualState.dashboardItems.length).toEqual(
                initialState.dashboardItems.length + 1
            );

            const expectedState = update(initialState, {
                dashboardItems: { $unshift: [newItem] },
            });

            expect(actualState).toMatchObject(expectedState);

            //check for pure function
            expect(initialState.dashboardItems.length).toEqual(2);
        });

        it('should update a dashboard item', () => {
            const updatedDashboardItem = {
                id: 'd1',
                type: 'APPLEJACK',
                w: 8,
                h: 8,
                x: 4,
                y: 4,
                shape: 'sloppy',
            };

            const actualState = reducer(initialState, {
                type: UPDATE_DASHBOARD_ITEM,
                value: updatedDashboardItem,
            });

            const actualItem = actualState.dashboardItems.find(
                item => item.id === 'd1'
            );
            expect(actualItem).toEqual(updatedDashboardItem);
        });

        it('should remove a dashboard item', () => {
            const removeIdx = 1;
            const itemToRemove = initialState.dashboardItems[removeIdx];

            const actualState = reducer(initialState, {
                type: REMOVE_DASHBOARD_ITEM,
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

    describe('sGetIsEditing selector', () => {
        it('should return "true" when state contains name property', () => {
            const isEditing = sGetIsEditing({
                editDashboard: { name: 'tinkywinky' },
            });

            expect(isEditing).toBe(true);
        });

        it('should return "true" when state contains dashboardItems property', () => {
            const isEditing = sGetIsEditing({
                editDashboard: { dashboardItems: [] },
            });

            expect(isEditing).toBe(true);
        });

        it('should return "true" when state contains description property', () => {
            const isEditing = sGetIsEditing({
                editDashboard: { description: 'tinkywinky' },
            });

            expect(isEditing).toBe(true);
        });

        it('should return "false" when state is an empty object', () => {
            const isEditing = sGetIsEditing({
                editDashboard: {},
            });

            expect(isEditing).toBe(false);
        });
    });
});
