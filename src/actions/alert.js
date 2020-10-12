import { SET_ALERT_MESSAGE, CLEAR_ALERT_MESSAGE } from '../reducers/alert'

export const acSetAlertMessage = value => ({
    type: SET_ALERT_MESSAGE,
    value,
})

export const acClearAlertMessage = () => ({
    type: CLEAR_ALERT_MESSAGE,
})
