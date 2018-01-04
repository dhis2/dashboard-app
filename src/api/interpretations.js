import { getInstance } from 'd2/lib/d2';

const onError = error => console.log('Error: ', error);

export const getInterpretation = id => {
    const fields =
        'id,text,created,user[id,displayName],likedBy,comments[id,text,created,user[id,displayName]]';
    const url = `/interpretations/${id}?fields=${fields}`;
    return getInstance()
        .then(d2 => d2.Api.getApi().get(url))
        .catch(onError);
};

export const postInterpretation = data => {
    const url = `/interpretations/${data.objectType.toLowerCase()}/${
        data.objectId
    }`;
    const options = {
        headers: {
            'Content-Type': 'text/plain',
        },
    };

    return getInstance()
        .then(d2 => d2.Api.getApi().post(url, data.text, options))
        .catch(onError);
};

export const updateInterpretation = data => {
    const url = `/interpretations/${data.id}`;
    return getInstance()
        .then(d2 => d2.Api.getApi().update(url, data.text))
        .catch(onError);
};

export const deleteInterpretation = id => {
    const url = `/interpretations/${id}`;
    return getInstance()
        .then(d2 => d2.Api.getApi().delete(url))
        .catch(onError);
};

export const postInterpretationLike = id => {
    const url = `/interpretations/${id}/like`;
    return getInstance()
        .then(d2 => d2.Api.getApi().post(url))
        .catch(onError);
};

export const deleteInterpretationLike = id => {
    const url = `/interpretations/${id}/like`;
    return getInstance()
        .then(d2 => d2.Api.getApi().delete(url))
        .catch(onError);
};

export const postInterpretationComment = data => {
    const url = `/interpretations/${data.id}/comments`;
    return getInstance()
        .then(d2 => d2.Api.getApi().post(url, data.text))
        .catch(onError);
};

export const updateInterpretationComment = data => {
    const url = `/interpretations/${data.id}/comments/${data.commentId}`;
    return getInstance()
        .then(d2 => d2.Api.getApi().update(url, data.text))
        .catch(onError);
};

export const deleteInterpretationComment = data => {
    const url = `/interpretations/${data.id}/comments/${data.commentId}`;
    return getInstance()
        .then(d2 => d2.Api.getApi().delete(url))
        .catch(onError);
};
