export const REGISTER_PASSIVE_VIEW = 'REGISTER_PASSIVE_VIEW'

export default (state = false, action) => {
    switch (action.type) {
        case REGISTER_PASSIVE_VIEW: {
            return true
        }
        default:
            return state
    }
}

export const sGetPassiveViewRegistered = state => state.passiveViewRegistered
