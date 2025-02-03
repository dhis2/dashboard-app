export const NAMESPACE = 'dashboard'

const hasDashboardNamespace = async (engine) => {
    const userDataStore = await engine.query({
        userDataStore: {
            resource: 'userDataStore',
        },
    })

    return userDataStore?.userDataStore?.find((ns) => ns === NAMESPACE)
}

const getNamespace = async (engine) => {
    const hasNamespace = await hasDashboardNamespace(engine)

    if (hasNamespace) {
        return await engine.query({
            dashboard: {
                resource: `userDataStore/${NAMESPACE}`,
            },
        })
    } else {
        return await engine.mutate({
            resource: `userDataStore/${NAMESPACE}`,
            type: 'create',
            data: {},
        })
    }
}

export const apiPostUserDataStoreValue = async (key, value, engine) => {
    await getNamespace(engine)

    return await engine.mutate({
        resource: `userDataStore/${NAMESPACE}/${key}`,
        type: 'update',
        data: value,
    })
}

export const apiGetUserDataStoreValue = async (key, defaultValue, engine) => {
    const ns = await getNamespace(engine)
    const nsKeys = ns[NAMESPACE]

    const hasKey = nsKeys?.find((k) => k === key)

    if (hasKey) {
        return await engine.query({
            [key]: {
                resource: `userDataStore/${NAMESPACE}/${key}`,
            },
        })
    } else {
        await apiPostUserDataStoreValue(key, defaultValue, engine)
        console.log('(These errors to /userDataStore can be ignored)')
        return defaultValue
    }
}
