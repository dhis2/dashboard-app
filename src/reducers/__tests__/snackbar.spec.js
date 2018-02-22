import reducer, { actionTypes, DEFAULT_STATE } from '../snackbar';

describe('snackbar reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, {});

        expect(actualState).toEqual(DEFAULT_STATE);
    });

    it('should handle RECEIVED_MESSAGE action with only message', () => {
        const message = 'Loading "tinkywinky" dashboard';

        const action = {
            type: actionTypes.RECEIVED_MESSAGE,
            value: {
                message,
            },
        };

        const expectedState = {
            message,
            duration: null,
            open: false,
        };

        const actualState = reducer(DEFAULT_STATE, action);
        expect(actualState).toEqual(expectedState);
    });

    it('should handle RECEIVED_MESSAGE action with only message with duration previously set', () => {
        const message = 'Loading "tinkywinky" dashboard';
        const duration = 3000;

        const action = {
            type: actionTypes.RECEIVED_MESSAGE,
            value: {
                message,
            },
        };

        const expectedState = {
            message,
            duration,
            open: true,
        };

        const currentState = {
            message: 'You just won 1000 dollars',
            duration,
            open: true,
        };

        const actualState = reducer(currentState, action);
        expect(actualState).toEqual(expectedState);
    });

    it('should handle RECEIVED_MESSAGE action with message and duration', () => {
        const message = 'Loading "tinkywinky" dashboard';
        const duration = 3000;
        const open = true;

        const action = {
            type: actionTypes.RECEIVED_MESSAGE,
            value: {
                message,
                duration,
                open,
            },
        };

        const expectedState = {
            message,
            duration,
            open,
        };

        const actualState = reducer(DEFAULT_STATE, action);
        expect(actualState).toEqual(expectedState);
    });

    it('should handle the SNACKBAR_CLOSED action', () => {
        const action = {
            type: actionTypes.SNACKBAR_CLOSED,
        };

        const currentState = {
            message: 'You just won 1000 dollars',
            duration: 3000,
            open: true,
        };

        const actualState = reducer(currentState, action);

        expect(actualState).toEqual(DEFAULT_STATE);
    });
});
