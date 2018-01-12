import reducer, { actionTypes } from '../selected';

describe('selected dashboard reducer', () => {
    const defaultState = {
        id: null,
        edit: false,
        isLoading: false,
        showDescription: false,
    };

    describe('reducer', () => {
        it('should set the selected dashboard id', () => {
            const id = 'my favorite dashboard';
            const expectedState = Object.assign({}, defaultState, { id });

            const actualState = reducer(defaultState, {
                type: actionTypes.SET_SELECTED_ID,
                value: id,
            });

            expect(actualState).toEqual(expectedState);
        });

        it('should set the selected dashboard edit state', () => {
            const edit = true;
            const expectedState = Object.assign({}, defaultState, { edit });

            const actualState = reducer(defaultState, {
                type: actionTypes.SET_SELECTED_EDIT,
                value: edit,
            });

            expect(actualState).toEqual(expectedState);
        });

        it('should set the selected dashboard isLoading state', () => {
            const isLoading = true;
            const expectedState = Object.assign({}, defaultState, {
                isLoading,
            });

            const actualState = reducer(defaultState, {
                type: actionTypes.SET_SELECTED_ISLOADING,
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
                type: actionTypes.SET_SELECTED_SHOWDESCRIPTION,
                value: showDescription,
            });

            expect(actualState).toEqual(expectedState);
        });
    });
});
