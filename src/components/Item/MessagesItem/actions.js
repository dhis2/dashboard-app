import { RECEIVED_MESSAGES } from '../../../reducers/messages';
import { getMessages } from '../../../api/messages';

const onError = (action, error) => {
    console.log(`Error in action ${action}: ${error}`);
    return error;
};

export const receivedMessages = value => ({
    type: RECEIVED_MESSAGES,
    value,
});

export const tGetMessages = dashboardItemId => async dispatch => {
    try {
        const messages = await getMessages();
        const { messageConversations } = messages;

        return dispatch(receivedMessages(messageConversations));
    } catch (err) {
        return onError('Get Messages', err);
    }
};
