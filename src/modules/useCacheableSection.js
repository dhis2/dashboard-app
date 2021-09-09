import { useCacheableSection as useCacheableSectionAppRuntime } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'

export const useCacheableSection = dashboardId => {
    const { d2 } = useD2()
    const cacheableSectionId = `${d2.currentUser.id}-${dashboardId}`
    const cacheableSectionProps =
        useCacheableSectionAppRuntime(cacheableSectionId)
    return { ...cacheableSectionProps }
}
