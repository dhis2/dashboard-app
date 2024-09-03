import { SET_PRESENT_DASHBOARD } from '../reducers/presentDashboard.js'

export const acSetPresentDashboard = (isPresent) => ({
    type: SET_PRESENT_DASHBOARD,
    value: isPresent,
})
