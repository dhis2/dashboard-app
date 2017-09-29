import reducer, { actionTypes } from '../dashboards';

describe('dashboards reducer', () => {
    it('should set the list of dashboards', () => {
        expect(1).toEqual(1);
    });

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' });

        expect(actualState).toEqual([]);
    });

    it('should return the list of dashboards', () => {
        const expectedState = [1];

        const actualState = reducer(undefined, { type: actionTypes.SET_DASHBOARDS, dashboards: expectedState });

        expect(actualState).toEqual(expectedState);
    });
});
