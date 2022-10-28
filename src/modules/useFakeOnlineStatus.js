import { useOnlineStatus as useOriginalOnlineStatus } from '@dhis2/app-runtime'

console.log({ env: process.env.NODE_ENV })

/**
 * This is intended for a hot-fix type release, where this just returns
 * `online: true` so that offline local deployments get unblocked.
 * See https://dhis2.atlassian.net/browse/DHIS2-12937
 *
 * In test environments, use the existing hook to avoid remaking them
 */
export const useOnlineStatus = (...args) => {
    const originalHook = useOriginalOnlineStatus(...args)

    if (process.env.NODE_ENV === 'test') {
        return originalHook
    }

    return {
        online: true,
        offline: false,
        lastOnline: undefined,
    }
}
