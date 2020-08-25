import { getInstance } from 'd2'

export const NAMESPACE = 'dashboard'

export const hasNamespace = async d2 =>
    await d2.currentUser.dataStore.has(NAMESPACE)

export const getNamespace = async (d2, hasNamespace) =>
    hasNamespace
        ? await d2.currentUser.dataStore.get(NAMESPACE)
        : await d2.currentUser.dataStore.create(NAMESPACE)

export const apiPostUserDataStoreValue = async (key, value) => {
    const d2 = await getInstance()
    const ns = await getNamespace(d2, hasNamespace)

    ns.set(key, value)
}

export const apiGetUserDataStoreValue = async (key, defaultValue) => {
    const d2 = await getInstance()
    const namespace = await getNamespace(d2, await hasNamespace(d2))
    const hasKey = namespace.keys && namespace.keys.find(k => k === key)

    if (hasKey) {
        return await namespace.get(key)
    } else {
        await apiPostUserDataStoreValue(key, defaultValue, namespace)
        console.log('(These errors to /userDataStore can be ignored)')
        return defaultValue
    }
}
