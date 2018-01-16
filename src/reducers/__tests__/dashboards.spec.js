import update from 'immutability-helper';
import reducer, { actionTypes, DEFAULT_DASHBOARDS } from '../dashboards';

describe('dashboards reducer', () => {
    const boards = {
        dash1: {
            id: 'dash1',
            name: 'good stuff',
            dashboardItems: [],
        },
        dash2: {
            id: 'dash2',
            name: 'ok stuff',
            dashboardItems: [{ id: '234' }],
        },
    };

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' });

        expect(actualState).toEqual(DEFAULT_DASHBOARDS);
    });

    it('should set the list of dashboards by replacing the existing list', () => {
        const currentState = { dash0: { id: 'dash0' } };
        const actualState = reducer(currentState, {
            type: actionTypes.SET_DASHBOARDS,
            append: false,
            value: boards,
        });

        expect(actualState).toEqual(boards);
    });

    it('should append to the list of dashboards', () => {
        const currentState = { dash0: { id: 'dash0' } };
        const actualState = reducer(currentState, {
            type: actionTypes.SET_DASHBOARDS,
            append: true,
            value: boards,
        });

        const expected = Object.assign({}, boards, currentState);

        expect(actualState).toEqual(expected);
    });

    it('should add a dashboard item', () => {
        const newItem = {
            id: 'new dashboard item',
            size: 'large',
        };

        const actualState = reducer(boards, {
            type: actionTypes.ADD_DASHBOARD_ITEM,
            value: newItem,
            dashboardId: 'dash2',
        });

        const expectedState = update(boards, {
            dash2: { dashboardItems: { $push: [newItem] } },
        });

        expect(actualState).toMatchObject(expectedState);
    });
});
