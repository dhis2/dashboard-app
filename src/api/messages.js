import { getInstance } from 'd2/lib/d2';

export const getMessages = () => {
    const fields =
        'id,messageCount,lastUpdated,userSurname,messageType,displayName,read';
    const url = `/messageConversations?fields=${fields}`;
    return getInstance()
        .then(d2 => d2.Api.getApi().get(url))
        .catch(error => console.log('Error:', error));
};
