const RESOURCE = 'userDataStore/dashboard/recentDashboards'

const isNotFound = (error) => error?.details?.httpStatusCode === 404

// Contract: resolves to the stored entries array (possibly []) when the read
// succeeds, including when the key has never been created (404 == genuinely
// empty). Resolves to `null` when the request itself failed for any other
// reason (offline, 500, timeout, etc). Callers MUST treat `null` as "unknown"
// and NOT as "empty" — overwriting a cache with `null` would silently
// destroy the user's working set. Never throws.
export const apiGetRecentDashboards = async (dataEngine) => {
    try {
        const result = await dataEngine.query({
            recentDashboards: { resource: RESOURCE },
        })

        return Array.isArray(result?.recentDashboards?.entries)
            ? result.recentDashboards.entries
            : []
    } catch (error) {
        if (isNotFound(error)) {
            return []
        }

        console.info('Could not read recent dashboards:', error)

        return null
    }
}

// Contract: resolves to `true` when the write succeeded (either the update,
// or the create fallback after a 404), and `false` when it did not. Callers
// MUST check this before treating pending local writes as flushed — marking
// a failed write as flushed would destroy the pending-write signal and let
// a later pull overwrite local data that the server never received. Never
// throws.
export const apiPostRecentDashboards = async (dataEngine, entries) => {
    const data = { entries }

    try {
        await dataEngine.mutate({ resource: RESOURCE, type: 'update', data })
        return true
    } catch (error) {
        if (!isNotFound(error)) {
            console.info('Could not save recent dashboards:', error)
            return false
        }

        try {
            await dataEngine.mutate({
                resource: RESOURCE,
                type: 'create',
                data,
            })
            return true
        } catch (createError) {
            console.info('Could not create recent dashboards:', createError)
            return false
        }
    }
}
