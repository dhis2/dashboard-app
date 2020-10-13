export const SET_ALERT_MESSAGE = 'SET_ALERT_MESSAGE'
export const CLEAR_ALERT_MESSAGE = 'CLEAR_ALERT_MESSAGE'

export const DEFAULT_STATE_ALERT = null

export default (state = DEFAULT_STATE_ALERT, action) => {
    switch (action.type) {
        case SET_ALERT_MESSAGE: {
            return action.value
        }
        case CLEAR_ALERT_MESSAGE: {
            return DEFAULT_STATE_ALERT
        }
        default:
            return state
    }
}

// selectors

export const sGetAlertMessage = state => state.alert
