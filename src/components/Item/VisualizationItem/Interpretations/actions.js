import {
    sGetInterpretation,
    RECEIVED_INTERPRETATION,
    ADD_INTERPRETATIONS,
    REMOVE_INTERPRETATION,
} from '../../../../reducers/interpretations';
import { RECEIVED_VISUALIZATION } from '../../../../reducers/visualizations';
import {
    postInterpretationLike,
    deleteInterpretationLike,
    postInterpretationComment,
    updateInterpretation,
    updateInterpretationComment,
    deleteInterpretationComment,
    getInterpretation,
    postInterpretation,
    postInterpretationSharing,
    deleteInterpretation,
    fetchVisualization,
    fetchVisualizationSharing,
} from '../../../../api/interpretations';

// action creators

export const addInterpretation = value => ({
    type: RECEIVED_INTERPRETATION,
    value,
});

export const addInterpretations = value => ({
    type: ADD_INTERPRETATIONS,
    value,
});

export const removeInterpretation = value => ({
    type: REMOVE_INTERPRETATION,
    value,
});

export const acReceivedVisualization = value => ({
    type: RECEIVED_VISUALIZATION,
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

export const tUpdateInterpretation = data => async dispatch => {
    try {
        await updateInterpretation(data);
        return updateInterpretationInStore(data.id, dispatch);
    } catch (err) {
        return onError('Update Interpretation', err);
    }
};

export const tUpdateInterpretationComment = data => async dispatch => {
    try {
        await updateInterpretationComment(data);
        return updateInterpretationInStore(data.id, dispatch);
    } catch (err) {
        return onError('Update Interpretation Comment', err);
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
        return dispatch(acReceivedVisualization(vis));
    };

    try {
        await postInterpretation(data);
        const vis = await fetchVisualization(data);

        const newInterpretation = vis.interpretations.find(interpretation => {
            const exists = !!sGetInterpretation(getState(), interpretation.id);
            return !exists;
        });
        await updateInterpretationInStore([newInterpretation.id], dispatch);

        // get favorite sharing settings and set them on the new interpretation
        const visSharing = await fetchVisualizationSharing(data);

        if (visSharing && visSharing.object) {
            const sharing = {
                ...visSharing.object,
                // remove unwanted keys
                id: undefined,
                name: undefined,
                displayName: undefined,
            };

            await postInterpretationSharing({
                id: newInterpretation.id,
                sharing,
            });
        }

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
        return dispatch(acReceivedVisualization(vis));
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
