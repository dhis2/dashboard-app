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

const updateInterpretationInStore = (id, dispatch) => {
    return getInterpretation(id).then(interpretation => {
        return dispatch(addInterpretation(interpretation));
    });
};

// thunks

export const tLikeInterpretation = id => async dispatch => {
    try {
        await postInterpretationLike(id);
        return updateInterpretationInStore(id, dispatch);
    } catch (err) {
        return onError('Like Interpretation', err);
    }
};

export const tUnlikeInterpretation = id => async dispatch => {
    try {
        await deleteInterpretationLike(id);
        return updateInterpretationInStore(id, dispatch);
    } catch (err) {
        return onError('Unlike Interpretation', err);
    }
};

export const tAddInterpretationComment = data => async dispatch => {
    try {
        await postInterpretationComment(data);
        return updateInterpretationInStore(data.id, dispatch);
    } catch (err) {
        return onError('Add Interpretation Comment', err);
    }
};

export const tDeleteInterpretationComment = data => async dispatch => {
    try {
        await deleteInterpretationComment(data);
        return updateInterpretationInStore(data.id, dispatch);
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
