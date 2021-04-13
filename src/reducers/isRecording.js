export const SET_IS_RECORDING = 'SET_IS_RECORDING'

export default (state = false, action) => {
    switch (action.type) {
        case SET_IS_RECORDING: {
            return action.value
        }
        default:
            return state
    }
}

export const sGetIsRecording = state => state.isRecording
