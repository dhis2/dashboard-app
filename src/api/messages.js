export const messageConversationsQuery = {
    resource: 'messageConversations',
    params: {
        fields:
            'id,messageCount,lastUpdated,messageType,displayName,read,messages[id,read,sender[id,displayName],text,lastUpdated]',
        order: 'read:asc',
        pageSize: 200,
    },
}

export const getMessages = async dataEngine => {
    try {
        const { messageConversations } = await dataEngine.query({
            messageConversations: messageConversationsQuery,
        })

        return messageConversations.messageConversations
    } catch (error) {
        console.log('Error:', error)
    }
}
