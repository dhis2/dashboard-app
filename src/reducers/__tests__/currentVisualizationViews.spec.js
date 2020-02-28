import reducer, {
    // ADD_CURRENT_VISUALIZATION_VIEW,
    SET_CURRENT_VISUALIZATION_VIEW,
} from '../currentVisualizationViews';

describe('current vis reducer', () => {
    const visId = 'rainbow';
    const visualization = {
        name: 'rainbow dash',
        type: 'LINE',
    };

    const newVis = {
        name: 'rainbow dash',
        type: 'PIVOT',
    };

    const state = {
        [visId]: visualization,
        pinkie: { name: 'pinkie pie', type: 'SINGLE_VALUE' },
    };

    it('should update a visualization with current vis (SET_CURRENT_VISUALIZATION_VIEW)', () => {
        const action = {
            type: SET_CURRENT_VISUALIZATION_VIEW,
            value: { id: visId, visualization: newVis },
        };

        const currentState = state;
        const expectedState = { [visId]: newVis };
        const actualState = reducer(currentState, action);

        expect(actualState).toEqual(expectedState);
    });
});
