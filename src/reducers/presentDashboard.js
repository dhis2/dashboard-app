export const SET_PRESENT_DASHBOARD = 'SET_PRESENT_DASHBOARD'

export default (state = false, action) => {
    switch (action.type) {
        case SET_PRESENT_DASHBOARD: {
            return action.value
        }
        default:
            return state
    }
}

export const sGetPresentDashboard = (state) => state.presentDashboard
