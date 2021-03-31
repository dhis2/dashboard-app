import reducer, { DEFAULT_STATE_USERNAME, SET_USERNAME } from '../username'

describe('username reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, {})

        expect(actualState).toEqual(DEFAULT_STATE_USERNAME)
    })

    it('should handle SET_USERNAME action', () => {
        const username = 'tinkywinky'

        const action = {
            type: SET_USERNAME,
            value: {
                username,
            },
        }

        const actualState = reducer(DEFAULT_STATE_USERNAME, action)
        expect(actualState).toEqual(username)
    })
})
