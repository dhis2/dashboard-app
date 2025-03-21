import { useCachedDataQuery } from '@dhis2/analytics'
import { useCacheableSection as useCacheableSectionAppRuntime } from '@dhis2/app-runtime'
import { getCacheableSectionId } from './getCacheableSectionId.js'

export const useCacheableSection = (dashboardId) => {
    const { currentUser } = useCachedDataQuery()

    const cacheableSectionProps = useCacheableSectionAppRuntime(
        getCacheableSectionId(currentUser.id, dashboardId)
    )
    return { ...cacheableSectionProps }
}
