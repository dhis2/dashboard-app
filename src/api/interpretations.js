import { getInstance } from 'd2';
import { itemTypeMap } from '../modules/itemTypes';

const onError = error => console.log('Error: ', error);

// Fields
export const interpretationFields = () => {
    return 'interpretations[id]';
    // return 'interpretations[id,text,created,user[id,displayName],likedBy,comments[id,text,created,user[id,displayName]]]';
};

// Api
export const getInterpretation = id => {
    const fields = encodeURI(
        'id,text,created,user[id,displayName],likedBy,access,comments[id,text,created,user[id,displayName]]'
    );
    const url = `/interpretations/${id}?fields=${fields}`;
    return getInstance()
        .then(d2 => d2.Api.getApi().get(url))
        .catch(onError);
};

export const postInterpretation = data => {
    const typePath = itemTypeMap[data.objectType].propName;
    const url = `/interpretations/${typePath}/${data.objectId}`;
    const headers = { 'Content-Type': 'text/plain' };

    return getInstance()
        .then(d2 => d2.Api.getApi().post(url, data.text, { headers }))
        .catch(onError);
};

export const postInterpretationSharing = data => {
    const url = `/sharing?type=interpretation&id=${data.id}`;

    return getInstance()
        .then(d2 => d2.Api.getApi().post(url, { object: data.sharing }))
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
    const headers = { 'Content-Type': 'text/plain' };

    return getInstance()
        .then(d2 => d2.Api.getApi().post(url, data.text, { headers }))
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

export const fetchVisualization = data => {
    const typePath = itemTypeMap[data.objectType].endPointName;
    const url = encodeURI(
        `/${typePath}/${data.objectId}?fields=id,name,interpretations[id]`
    );

    return getInstance()
        .then(d2 => d2.Api.getApi().get(url))
        .catch(onError);
};

export const fetchVisualizationSharing = data => {
    const type = itemTypeMap[data.objectType].propName;
    const url = `/sharing?type=${type}&id=${data.objectId}`;

    return getInstance()
        .then(d2 => d2.Api.getApi().get(url))
        .catch(onError);
};
