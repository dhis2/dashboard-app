import { actionTypes } from '../../reducers/interpretations';
import { postInterpretationComment } from '../../api/interpretations';

//action creators

export const addInterpretation = value => ({
    type: actionTypes.ADD_INTERPRETATION,
    value,
});

export const editInterpretation = (id, text) => ({
    type: actionTypes.EDIT_INTERPRETATION,
    value: { id, text },
});

export const deleteInterpretation = id => ({
    type: actionTypes.DELETE_INTERPRETATION,
    value: id,
});

export const addInterpretationComment = value => ({
    type: actionTypes.ADD_INTERPRETATION_COMMENT,
    value,
});

export const editInterpretationComment = (id, text) => ({
    type: actionTypes.EDIT_INTERPRETATION_COMMENT,
    value: { id, text },
});

export const deleteInterpretationComment = id => ({
    type: actionTypes.DELETE_INTERPRETATION_COMMENT,
    value: id,
});

export const likeInterpretation = id => ({
    type: actionTypes.LIKE_INTERPRETATION,
    value: id,
});

export const unlikeInterpretation = id => ({
    type: actionTypes.UNLIKE_INTERPRETATION,
    value: id,
});

//thunks

export const tAddInterpretationComment = () => async (dispatch, getState) => {
    const onSuccess = data => {
        dispatch(acSetDashboards(data.toArray()));
        return data;
    };

    const onError = error => {
        console.log('Error (addInterpretationComment): ', error);
        return error;
    };

    try {
        const collection = await apiFetchDashboards();
        return onSuccess(collection);
    } catch (err) {
        return onError(err);
    }
};
