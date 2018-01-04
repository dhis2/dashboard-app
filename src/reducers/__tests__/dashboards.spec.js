import reducer, { actionTypes, DEFAULT_DASHBOARDS } from '../dashboards';

describe('dashboards reducer', () => {
    it('should set the list of dashboards', () => {
        expect(1).toEqual(1);
    });

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' });

        expect(actualState).toEqual(DEFAULT_DASHBOARDS);
    });

    it('should return the list of dashboards', () => {
        const expectedState = {
            id: 'abc',
            description: 'description',
            created: '2013-09-08',
            lastUpdated: '2013-09-08',
            dashboardItems: [],
            user: {
                name: 'name',
            },
        };

        const actualState = reducer(undefined, {
            type: actionTypes.SET_DASHBOARDS,
            value: [expectedState],
        });

        expect(actualState).toEqual(expectedState);
    });

    it('should return the appended list of dashboards', () => {
        const currentState = {
            a: {
                id: 'a',
            },
        };

        const actionValue = [
            {
                b: {
                    id: 'b',
                },
            },
        ];

        const expectedState = {
            a: {
                id: 'a',
            },
            b: {
                id: 'b',
            },
        };

        const actualState = reducer(currentState, {
            type: actionTypes.SET_DASHBOARDS,
            append: true,
            value: actionValue,
        });

        expect(actualState).toEqual(expectedState);
    });
});
