import reducer, {
    DEFAULT_STATE_SNACKBAR,
    RECEIVED_SNACKBAR_MESSAGE,
    CLOSE_SNACKBAR,
} from '../snackbar';

describe('snackbar reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, {});

        expect(actualState).toEqual(DEFAULT_STATE_SNACKBAR);
    });

    it('should handle RECEIVED_SNACKBAR_MESSAGE action with message object containing only message text', () => {
        const message = {
            name: 'Loading "tinkywinky" dashboard',
            type: 'LOADING_TINKYWINKY',
        };

        const action = {
            type: RECEIVED_SNACKBAR_MESSAGE,
            value: {
                message,
            },
        };

        const expectedState = {
            message,
            duration: null,
            open: false,
        };

        const actualState = reducer(DEFAULT_STATE_SNACKBAR, action);
        expect(actualState).toEqual(expectedState);
    });

    it('should handle RECEIVED_SNACKBAR_MESSAGE action with message object with duration previously set', () => {
        const message = {
            name: 'Loading "tinkywinky" dashboard',
            type: 'LOADING_TINKYWINKY',
        };
        const duration = 3000;

        const action = {
            type: RECEIVED_SNACKBAR_MESSAGE,
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

    it('should handle RECEIVED_SNACKBAR_MESSAGE action with message object containing text and duration', () => {
        const message = {
            name: 'Loading "tinkywinky" dashboard',
            type: 'LOADING_TINKYWINKY',
        };
        const duration = 3000;
        const open = true;

        const action = {
            type: RECEIVED_SNACKBAR_MESSAGE,
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

        const actualState = reducer(DEFAULT_STATE_SNACKBAR, action);
        expect(actualState).toEqual(expectedState);
    });

    it('should handle RECEIVED_SNACKBAR_MESSAGE action with message string', () => {
        const message = 'Loading "tinkywinky" dashboard';
        const duration = 3000;
        const open = true;

        const action = {
            type: RECEIVED_SNACKBAR_MESSAGE,
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

        const actualState = reducer(DEFAULT_STATE_SNACKBAR, action);
        expect(actualState).toEqual(expectedState);
    });

    it('should handle the CLOSE_SNACKBAR action', () => {
        const action = {
            type: CLOSE_SNACKBAR,
        };

        const currentState = {
            message: 'You just won 1000 dollars',
            duration: 3000,
            open: true,
        };

        const actualState = reducer(currentState, action);

        expect(actualState).toEqual(DEFAULT_STATE_SNACKBAR);
    });
});
