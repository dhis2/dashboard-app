import reducer, {
    DEFAULT_STATE_ITEM_FILTER,
    SET_ITEM_FILTER,
} from '../itemFilter';

const testKey = 'userOrgUnit';
const testValue = ['uid'];

const testState = {
    [testKey]: testValue,
};

describe('item filter reducer', () => {
    describe('reducer', () => {
        it('should return the default state', () => {
            const actualState = reducer(DEFAULT_STATE_ITEM_FILTER, {});

            expect(actualState).toEqual(DEFAULT_STATE_ITEM_FILTER);
        });

        it('should set a filter', () => {
            const action = {
                type: SET_ITEM_FILTER,
                key: testKey,
                value: testValue,
            };

            const expectedState = testState;

            const actualState = reducer(undefined, action);

            expect(actualState).toEqual(expectedState);
        });

        it('should remove a filter', () => {
            const action = {
                type: SET_ITEM_FILTER,
                key: testKey,
            };

            const expectedState = DEFAULT_STATE_ITEM_FILTER;

            const actualState = reducer(testState, action);

            expect(actualState).toEqual(expectedState);
        });
    });
});
