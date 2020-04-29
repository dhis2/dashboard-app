import reducer, {
    DEFAULT_STATE_VISUALIZATIONS,
    ADD_VISUALIZATION,
    SET_ACTIVE_VISUALIZATION_TYPE,
} from '../visualizations'

describe('visualizations reducer', () => {
    const activeType = 'CHART'

    const visualization = {
        id: 'abc',
        name: 'funny name',
    }

    const visualizationWithActiveType = {
        ...visualization,
        activeType,
    }

    const state = {
        [visualization.id]: visualization,
    }

    const stateWithActiveType = {
        [visualization.id]: visualizationWithActiveType,
    }

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' })
        const expectedState = DEFAULT_STATE_VISUALIZATIONS

        expect(actualState).toEqual(expectedState)
    })

    it('should add a visualization (ADD_VISUALIZATION)', () => {
        const action = {
            type: ADD_VISUALIZATION,
            value: visualization,
        }

        const actualState = reducer(DEFAULT_STATE_VISUALIZATIONS, action)
        const expectedState = state

        expect(actualState).toEqual(expectedState)
    })

    it('should update a visualization with activeType (SET_ACTIVE_VISUALIZATION_TYPE)', () => {
        const action = {
            type: SET_ACTIVE_VISUALIZATION_TYPE,
            id: visualization.id,
            activeType,
        }

        const currentState = state
        const expectedState = stateWithActiveType
        const actualState = reducer(currentState, action)

        expect(actualState).toEqual(expectedState)
    })

    it('should update a visualization with removed activeType (SET_ACTIVE_VISUALIZATION_TYPE)', () => {
        const action = {
            type: SET_ACTIVE_VISUALIZATION_TYPE,
            id: visualization.id,
        }

        const currentState = stateWithActiveType
        const expectedState = state
        const actualState = reducer(currentState, action)

        expect(actualState).toEqual(expectedState)
    })
})
