import reducer, {
    DEFAULT_STATE_VISUALIZATIONS,
    ADD_VISUALIZATION,
} from '../visualizations';

describe('visualizations reducer', () => {
    const visualization = {
        id: 'abc',
        name: 'funny name',
    };

    const state = {
        [visualization.id]: visualization,
    };

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' });
        const expectedState = DEFAULT_STATE_VISUALIZATIONS;

        expect(actualState).toEqual(expectedState);
    });

    it('should add a visualization (ADD_VISUALIZATION)', () => {
        const action = {
            type: ADD_VISUALIZATION,
            value: visualization,
        };

        const actualState = reducer(DEFAULT_STATE_VISUALIZATIONS, action);
        const expectedState = state;

        expect(actualState).toEqual(expectedState);
    });
});
