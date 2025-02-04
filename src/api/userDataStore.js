export const NAMESPACE = 'dashboard'

const hasDashboardNamespace = async (dataEngine) => {
    const userDataStore = await dataEngine.query({
        userDataStore: {
            resource: 'userDataStore',
        },
    })

    return userDataStore?.userDataStore?.find((ns) => ns === NAMESPACE)
}

const getNamespace = async (dataEngine) => {
    const hasNamespace = await hasDashboardNamespace(dataEngine)

    if (hasNamespace) {
        return await dataEngine.query({
            dashboard: {
                resource: `userDataStore/${NAMESPACE}`,
            },
        })
    } else {
        return await dataEngine.mutate({
            resource: `userDataStore/${NAMESPACE}`,
            type: 'create',
            data: {},
        })
    }
}

export const apiPostUserDataStoreValue = async (key, value, dataEngine) => {
    await getNamespace(dataEngine)

    return await dataEngine.mutate({
        resource: `userDataStore/${NAMESPACE}/${key}`,
        type: 'update',
        data: `${value}`,
    })
}

export const apiGetUserDataStoreValue = async (
    key,
    defaultValue,
    dataEngine
) => {
    const ns = await getNamespace(dataEngine)
    const nsKeys = ns[NAMESPACE]

    const hasKey = nsKeys?.find((k) => k === key)

    if (hasKey) {
        const result = await dataEngine.query({
            [key]: {
                resource: `userDataStore/${NAMESPACE}/${key}`,
            },
        })
        return result[key]
    } else {
        await apiPostUserDataStoreValue(key, defaultValue, dataEngine)
        console.log('(These errors to /userDataStore can be ignored)')
        return defaultValue
    }
}
