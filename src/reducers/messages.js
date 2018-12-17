import update from 'immutability-helper';
import { arrayToIdMap } from '../util';

export const actionTypes = {
    RECEIVED_MESSAGES: 'RECEIVED_MESSAGES',
};

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.RECEIVED_MESSAGES: {
            const conversations = arrayToIdMap(action.value);

            const newState = update(state, { $merge: conversations });

            return newState;
        }
        default:
            return state;
    }
};

// selectors

export const sGetMessagesRoot = state => state.messages;
