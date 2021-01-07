import { RECEIVED_MESSAGES } from '../../../reducers/messages'
import { getMessages } from '../../../api/messages'

const onError = (action, error) => {
    console.log(`Error in action ${action}: ${error}`)
    return error
}

export const receivedMessages = value => ({
    type: RECEIVED_MESSAGES,
    value,
})

export const tGetMessages = dataEngine => async dispatch => {
    try {
        const messageConversations = await getMessages(dataEngine)

        return dispatch(receivedMessages(messageConversations))
    } catch (err) {
        return onError('Get Messages', err)
    }
}
