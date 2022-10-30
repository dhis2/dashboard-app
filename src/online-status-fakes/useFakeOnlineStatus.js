import { useOnlineStatus as useOriginalOnlineStatus } from '@dhis2/app-runtime'

/**
 * This is intended for a hot-fix type release, where this just returns
 * `online: true` so that offline local deployments get unblocked.
 * See https://dhis2.atlassian.net/browse/DHIS2-12937
 *
 * In the future, this should be fixed by using a smarter connection
 * status-detecting hook; see https://dhis2.atlassian.net/browse/LIBS-315
 */
const useFakeOnlineStatus = () => ({ online: true, offline: false })

/** In test environments, use the original hook to avoid breaking tests */
export const useOnlineStatus =
    process.env.NODE_ENV === 'test'
        ? useOriginalOnlineStatus
        : useFakeOnlineStatus
