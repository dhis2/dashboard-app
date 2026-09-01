export const getCacheableSectionId = (userId, dashboardId) =>
    `${userId}-${dashboardId}`

export const getOfflineDashboardIds = (userId, cachedSections) => {
    const dashboardIds = []

    for (const key in cachedSections) {
        const [part1, part2] = key.split('-')
        if (part1 === userId) {
            dashboardIds.push(part2)
        }
    }

    return dashboardIds.sort()
}
