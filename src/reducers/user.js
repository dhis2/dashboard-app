export const actionTypes = {
    RECEIVED_USER: 'RECEIVED_USER',
};

export const defaultState = {
    username: '',
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.RECEIVED_USER: {
            const { username } = action.value;
            return { username };
        }
        default:
            return state;
    }
};

// selectors

export const sGetUsername = state => state.user.username;
