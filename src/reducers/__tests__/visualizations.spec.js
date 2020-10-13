import reducer, {
    DEFAULT_STATE_VISUALIZATIONS,
    ADD_VISUALIZATION,
    CLEAR_VISUALIZATIONS,
} from '../visualizations'

describe('visualizations reducer', () => {
    const visualization = {
        id: 'rainbowDash',
        name: 'Rainbow Dash',
    }

    const state = {
        [visualization.id]: visualization,
    }

    it('should return the default state', () => {
        const actualState = reducer(undefined, {})
        const expectedState = DEFAULT_STATE_VISUALIZATIONS

        expect(actualState).toEqual(expectedState)
    })

    it('adds a visualization (ADD_VISUALIZATION)', () => {
        const action = {
            type: ADD_VISUALIZATION,
            value: visualization,
        }

        const actualState = reducer(DEFAULT_STATE_VISUALIZATIONS, action)

        expect(actualState).toEqual(state)
    })

    it('updates a visualization', () => {
        const action = {
            type: ADD_VISUALIZATION,
            value: visualization,
        }

        const newState = reducer(undefined, action)
        expect(newState).toEqual(state)

        const value = Object.assign({}, visualization, { age: 10 })

        const updatedState = reducer(newState, {
            type: ADD_VISUALIZATION,
            value,
        })

        expect(updatedState).toEqual({
            rainbowDash: { id: 'rainbowDash', name: 'Rainbow Dash', age: 10 },
        })
    })

    it('clears the visualizations', () => {
        const action = {
            type: ADD_VISUALIZATION,
            value: visualization,
        }

        const newState = reducer(undefined, action)
        expect(newState).toEqual(state)

        const updatedState = reducer(newState, { type: CLEAR_VISUALIZATIONS })
        expect(updatedState).toEqual(DEFAULT_STATE_VISUALIZATIONS)
    })
})
