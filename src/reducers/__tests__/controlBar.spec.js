import reducer, {
    SET_CONTROLBAR_USER_ROWS,
    DEFAULT_STATE_CONTROLBAR_ROWS,
} from '../controlBar';

describe('controlbar reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, {});

        expect(actualState).toEqual({
            userRows: DEFAULT_STATE_CONTROLBAR_ROWS,
        });
    });

    it('should handle SET_CONTROLBAR_USER_ROWS', () => {
        const rows = 4;
        const action = {
            type: SET_CONTROLBAR_USER_ROWS,
            value: rows,
        };

        const expectedState = { userRows: rows };

        const actualState = reducer(undefined, action);

        expect(actualState).toEqual(expectedState);
    });
});
