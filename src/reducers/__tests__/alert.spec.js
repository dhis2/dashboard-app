import reducer, {
    DEFAULT_STATE_ALERT,
    SET_ALERT_MESSAGE,
    CLEAR_ALERT_MESSAGE,
    sGetAlertMessage,
} from '../alert'

describe('alert reducer', () => {
    it('should return the default state', () => {
        const actualState = reducer(undefined, {})

        expect(actualState).toEqual(DEFAULT_STATE_ALERT)
    })

    it('sets the alert message', () => {
        const message = 'Loading dashboard: Rainbow dash'
        const action = {
            type: SET_ALERT_MESSAGE,
            value: message,
        }

        const expectedState = message

        const actualState = reducer(DEFAULT_STATE_ALERT, action)
        expect(actualState).toEqual(expectedState)
    })

    it('clears the alert message', () => {
        const action = {
            type: CLEAR_ALERT_MESSAGE,
        }

        const currentState = 'Loading dashboard: Rainbow dash'

        const actualState = reducer(currentState, action)

        expect(actualState).toEqual(DEFAULT_STATE_ALERT)
    })

    it('gets the current message from state', () => {
        const message = 'Loading dashboard: Rainbow dash'
        const action = {
            type: SET_ALERT_MESSAGE,
            value: message,
        }
        const alert = reducer(null, action)

        const messageInState = sGetAlertMessage({ alert })

        expect(messageInState).toEqual(message)
    })
})
