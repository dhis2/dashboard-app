import reducer, {
    SET_SELECTED_ID,
    SET_SELECTED_ISLOADING,
    SET_SELECTED_SHOWDESCRIPTION,
} from '../selected';

describe('selected dashboard reducer', () => {
    const defaultState = {
        id: null,
        isLoading: false,
        showDescription: false,
    };

    describe('reducer', () => {
        it('should set the selected dashboard id', () => {
            const id = 'my favorite dashboard';
            const expectedState = Object.assign({}, defaultState, { id });

            const actualState = reducer(defaultState, {
                type: SET_SELECTED_ID,
                value: id,
            });

            expect(actualState).toEqual(expectedState);
        });

        it('should set the selected dashboard isLoading state', () => {
            const isLoading = true;
            const expectedState = Object.assign({}, defaultState, {
                isLoading,
            });

            const actualState = reducer(defaultState, {
                type: SET_SELECTED_ISLOADING,
                value: isLoading,
            });

            expect(actualState).toEqual(expectedState);
        });

        it('should set the selected dashboard showDescription state', () => {
            const showDescription = true;
            const expectedState = Object.assign({}, defaultState, {
                showDescription,
            });

            const actualState = reducer(defaultState, {
                type: SET_SELECTED_SHOWDESCRIPTION,
                value: showDescription,
            });

            expect(actualState).toEqual(expectedState);
        });
    });
});
