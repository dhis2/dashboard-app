import { NAV_TABS } from './navigationTabs.js'

export const getDashboardsForTab = ({
    dashboards,
    tab,
    currentUserId,
    recentIds,
}) => {
    switch (tab) {
        case NAV_TABS.STARRED:
            return dashboards.filter((dashboard) => dashboard.starred === true)
        case NAV_TABS.MINE:
            return dashboards.filter(
                (dashboard) => dashboard.createdBy?.id === currentUserId
            )
        case NAV_TABS.RECENT: {
            const dashboardsById = new Map(
                dashboards.map((dashboard) => [dashboard.id, dashboard])
            )

            // filter(Boolean) drops ids for dashboards that were deleted or
            // that the user can no longer see, so stale Recent entries
            // disappear silently instead of rendering as undefined.
            return recentIds.map((id) => dashboardsById.get(id)).filter(Boolean)
        }
        case NAV_TABS.ALL:
        default:
            // Returns the same array reference that was passed in (not a
            // copy, unlike the other branches) — callers must not mutate it.
            return dashboards
    }
}
