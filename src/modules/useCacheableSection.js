import { useCacheableSection as useCacheableSectionAppRuntime } from '@dhis2/app-runtime'
import { useCurrentUser } from '../components/AppDataProvider/AppDataProvider.jsx'
import getCacheableSectionId from './getCacheableSectionId.js'

export const useCacheableSection = (dashboardId) => {
    const currentUser = useCurrentUser()

    const cacheableSectionProps = useCacheableSectionAppRuntime(
        getCacheableSectionId(currentUser.id, dashboardId)
    )
    return { ...cacheableSectionProps }
}
