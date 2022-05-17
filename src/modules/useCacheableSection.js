import { useCacheableSection as useCacheableSectionAppRuntime } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import getCacheableSectionId from './getCacheableSectionId.js'

export const useCacheableSection = (dashboardId) => {
    const { d2 } = useD2()

    const cacheableSectionProps = useCacheableSectionAppRuntime(
        getCacheableSectionId(d2.currentUser.id, dashboardId)
    )
    return { ...cacheableSectionProps }
}
