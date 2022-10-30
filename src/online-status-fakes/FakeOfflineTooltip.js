import { OfflineTooltip as OriginalOfflineTooltip } from '@dhis2/analytics'

/**
 * This is part of the hotfix described in useFakeOnlineStatus.js
 *
 * The original offline tooltip consumes useOnlineStatus too, so we mock this
 * with a fake (except for in tests, so they don't break in this branch)
 */
const FakeOfflineTooltip = ({ children }) => children

export const OfflineTooltip =
    process.env.NODE_ENV === 'test'
        ? OriginalOfflineTooltip
        : FakeOfflineTooltip
