import { actionTypes, fromInterpretations } from '../../../reducers';
import {
    postInterpretationLike,
    deleteInterpretationLike,
    postInterpretationComment,
    deleteInterpretationComment,
    getInterpretation,
    postInterpretation,
    deleteInterpretation,
    fetchVisualization,
} from '../../../api/interpretations';

// action creators

export const addInterpretation = value => ({
    type: actionTypes.ADD_INTERPRETATION,
    value,
});

export const addInterpretations = value => ({
    type: actionTypes.ADD_INTERPRETATIONS,
    value,
});

export const removeInterpretation = value => ({
    type: actionTypes.REMOVE_INTERPRETATION,
    value,
});

export const receivedVisualization = value => ({
    type: actionTypes.RECEIVED_VISUALIZATION,
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

/**
 * Post the new interpretation, then get the updated list of interpretations
 * for the visualization and update the store with that, then get the new
 * interpretation
 * @param {Object} data
 */
export const tPostInterpretation = data => async (dispatch, getState) => {
    const onSuccess = vis => {
        return dispatch(receivedVisualization(vis));
    };

    try {
        await postInterpretation(data);
        const vis = await fetchVisualization(data);

        const newInterpretation = vis.interpretations.find(interpretation => {
            const exists = !!fromInterpretations.sGetInterpretation(
                getState(),
                interpretation.id
            );
            return !exists;
        });
        await updateInterpretationInStore([newInterpretation.id], dispatch);

        return onSuccess(vis);
    } catch (err) {
        return onError('Post Interpretation', err);
    }
};

/**
 * Post the new interpretation, then get the updated list of interpretations
 * for the visualization and update the store with that, then get the new
 * interpretation
 * @param {Object} data
 */
export const tDeleteInterpretation = data => async (dispatch, getState) => {
    const onSuccess = vis => {
        return dispatch(receivedVisualization(vis));
    };

    try {
        await deleteInterpretation(data.id);
        const vis = await fetchVisualization(data);
        dispatch(removeInterpretation(data.id));

        return onSuccess(vis);
    } catch (err) {
        return onError('Delete Interpretation', err);
    }
};
