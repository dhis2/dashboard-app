import reducer, { actionTypes, defaultState } from '../user'

describe('user reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, {})

        expect(actualState).toEqual(defaultState)
    })

    it('should handle RECEIVED_USER action', () => {
        const id = '35abc42'
        const username = 'tinkywinky'
        const uiLocale = 'teletubbie'

        const action = {
            type: actionTypes.RECEIVED_USER,
            value: {
                id,
                username,
                settings: {
                    keyUiLocale: uiLocale
                },
                authorities: {
                    has: () => true
                }
            }
        }

        const expectedState = {
            id,
            username,
            uiLocale,
            isSuperuser: true
        }

        const actualState = reducer(defaultState, action)
        expect(actualState).toEqual(expectedState)
    })
})
