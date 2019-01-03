import reducer, { DEFAULT_STATE_USER, RECEIVED_USER } from '../user';

describe('user reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, {});

        expect(actualState).toEqual(DEFAULT_STATE_USER);
    });

    it('should handle RECEIVED_USER action', () => {
        const id = '35abc42';
        const username = 'tinkywinky';
        const uiLocale = 'teletubbie';

        const action = {
            type: RECEIVED_USER,
            value: {
                id,
                username,
                settings: {
                    keyUiLocale: uiLocale,
                },
                authorities: {
                    has: () => true,
                },
            },
        };

        const expectedState = {
            id,
            username,
            uiLocale,
            isSuperuser: true,
        };

        const actualState = reducer(DEFAULT_STATE_USER, action);
        expect(actualState).toEqual(expectedState);
    });
});
