export const RECEIVED_USER = 'RECEIVED_USER';

export const DEFAULT_STATE_USER = {
    id: '',
    username: '',
    uiLocale: '',
    isSuperuser: false,
};

export default (state = DEFAULT_STATE_USER, action) => {
    switch (action.type) {
        case RECEIVED_USER: {
            return fromD2ToUserObj(action.value);
        }
        default:
            return state;
    }
};

function fromD2ToUserObj(d2Object) {
    return {
        id: d2Object.id,
        username: d2Object.username,
        uiLocale: d2Object.settings.keyUiLocale,
        isSuperuser: d2Object.authorities.has('ALL'),
    };
}

// selectors

export const sGetUserId = state => state.user.id;
export const sGetUserUsername = state => state.user.username;
export const sGetIsSuperuser = state => state.user.isSuperuser;
export const sGetUiLocale = state => state.user.uiLocale;
