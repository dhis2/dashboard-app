const NAMESPACE = 'dashboard'

const hasDashboardNamespace = async (dataEngine) => {
    const userDataStore = await dataEngine.query({
        userDataStore: {
            resource: 'userDataStore',
        },
    })

    return !!userDataStore?.userDataStore?.find((ns) => ns === NAMESPACE)
}

const hasNamespaceKey = async (dataEngine, key) => {
    const hasNamespace = await hasDashboardNamespace(dataEngine)
    const keys = hasNamespace
        ? await dataEngine.query({
              keys: {
                  resource: `userDataStore/${NAMESPACE}`,
              },
          })
        : {}

    return !!keys.keys?.find((k) => k === key)
}

const createValue = async (dataEngine, key, value) =>
    await dataEngine.mutate({
        resource: `userDataStore/${NAMESPACE}/${key}`,
        type: 'create',
        data: `${value}`,
    })

export const apiPostUserDataStoreValue = async (key, value, dataEngine) => {
    const hasKey = await hasNamespaceKey(dataEngine, key)

    if (!hasKey) {
        return await createValue(dataEngine, key, value)
    } else {
        return await dataEngine.mutate({
            resource: `userDataStore/${NAMESPACE}/${key}`,
            type: 'update',
            data: `${value}`,
        })
    }
}

export const apiGetUserDataStoreValue = async (
    key,
    defaultValue,
    dataEngine
) => {
    const hasKey = await hasNamespaceKey(dataEngine, key)

    if (hasKey) {
        const result = await dataEngine.query({
            [key]: {
                resource: `userDataStore/${NAMESPACE}/${key}`,
            },
        })
        return result[key]
    } else {
        await createValue(dataEngine, key, defaultValue)
        return defaultValue
    }
}
