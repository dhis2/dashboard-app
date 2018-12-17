import { getInstance } from 'd2';

export const getMessages = () => {
    const fields =
        'id,messageCount,lastUpdated,messageType,displayName,read,messages[id,read,sender[id,displayName],text,lastUpdated]';
    const url = `/messageConversations?fields=${fields}&order=read:asc&pageSize=200`;
    return getInstance()
        .then(d2 => d2.Api.getApi().get(url))
        .catch(error => console.log('Error:', error));
};
