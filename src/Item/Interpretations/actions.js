import { actionTypes } from '../../reducers/interpretations';
import {
    postInterpretationLike,
    deleteInterpretationLike,
    postInterpretationComment,
    deleteInterpretationComment,
    getInterpretation,
    postInterpretation,
} from '../../api/interpretations';

import { tSetSelectedDashboardById } from '../../actions';

// action creators

export const addInterpretation = value => ({
    type: actionTypes.ADD_INTERPRETATION,
    value,
});

export const addInterpretations = value => ({
    type: actionTypes.ADD_INTERPRETATIONS,
    value,
});

// error function for all!

const onError = (action, error) => {
    console.log(`Error in action ${action}: ${error}`);
    return error;
};

// thunks

export const tLikeInterpretation = id => async dispatch => {
    const onSuccess = res => {
        return getInterpretation(id).then(interpretation => {
            return dispatch(addInterpretation(interpretation));
        });
    };

    try {
        const result = await postInterpretationLike(id);
        return onSuccess(result);
    } catch (err) {
        return onError('Like Interpretation', err);
    }
};

export const tUnlikeInterpretation = id => async dispatch => {
    const onSuccess = res => {
        return getInterpretation(id).then(interpretation => {
            return dispatch(addInterpretation(interpretation));
        });
    };

    try {
        const res = await deleteInterpretationLike(id);
        return onSuccess(res);
    } catch (err) {
        return onError('Unlike Interpretation', err);
    }
};

export const tAddInterpretationComment = data => async dispatch => {
    const onSuccess = res => {
        return getInterpretation(data.id).then(interpretation => {
            return dispatch(addInterpretation(interpretation));
        });
    };

    try {
        const res = await postInterpretationComment(data);
        return onSuccess(res);
    } catch (err) {
        return onError('Add Interpretation Comment', err);
    }
};

export const tDeleteInterpretationComment = data => async dispatch => {
    const onSuccess = res => {
        return getInterpretation(data.id).then(interpretation => {
            return dispatch(addInterpretation(interpretation));
        });
    };

    try {
        const res = await deleteInterpretationComment(data);
        return onSuccess(res);
    } catch (err) {
        return onError('Add Interpretation Comment', err);
    }
};
export const tGetInterpretations = ids => async dispatch => {
    const onSuccess = interpretations => {
        return dispatch(addInterpretations(interpretations));
    };

    try {
        const promises = [];
        ids.forEach(id =>
            promises.push(
                new Promise(resolve => {
                    getInterpretation(id).then(response => resolve(response));
                })
            )
        );

        const interpretations = await Promise.all(promises);
        return onSuccess(interpretations);
    } catch (err) {
        return onError('Get Interpretation', err);
    }
};

export const tPostInterpretation = (data, dashboardId) => async dispatch => {
    const onSuccess = res => {
        return dispatch(tSetSelectedDashboardById(dashboardId));
    };

    try {
        const res = await postInterpretation(data);
        return onSuccess(res);
    } catch (err) {
        return onError('Post Interpretation', err);
    }
};
