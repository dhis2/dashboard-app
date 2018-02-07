import reducer, { actionTypes, defaultState } from '../user';

describe('user reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, {});

        expect(actualState).toEqual(defaultState);
    });

    it('should handle RECEIVED_USER action', () => {
        const username = 'jen123';
        const action = {
            type: actionTypes.RECEIVED_USER,
            value: {
                username,
            },
        };

        const expectedState = {
            username,
        };

        const actualState = reducer(defaultState, action);
        expect(actualState).toEqual(expectedState);
    });
});
