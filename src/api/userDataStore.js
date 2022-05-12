import { getInstance } from 'd2'

export const NAMESPACE = 'dashboard'

export const hasDashboardNamespace = async (d2) =>
    await d2.currentUser.dataStore.has(NAMESPACE)

export const getNamespace = async (d2) => {
    const hasNamespace = await hasDashboardNamespace(d2)

    return hasNamespace
        ? await d2.currentUser.dataStore.get(NAMESPACE)
        : await d2.currentUser.dataStore.create(NAMESPACE)
}

export const apiPostUserDataStoreValue = async (key, value) => {
    const d2 = await getInstance()
    const ns = await getNamespace(d2)

    return ns.set(key, value)
}

export const apiGetUserDataStoreValue = async (key, defaultValue) => {
    const d2 = await getInstance()
    const ns = await getNamespace(d2)
    const hasKey = ns?.keys?.find((k) => k === key)

    if (hasKey) {
        return await ns.get(key)
    } else {
        await apiPostUserDataStoreValue(key, defaultValue, ns)
        console.log('(These errors to /userDataStore can be ignored)')
        return defaultValue
    }
}
