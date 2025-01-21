import { useConfig } from '@dhis2/app-service-config'
import { useCallback, useMemo } from 'react'

const useSupersetApiUrl = (resource) => {
    const { baseUrl } = useConfig()
    const url = useMemo(() => {
        // Trim slashes from start and end
        const cleanedResource = resource.split('/').filter(Boolean).join('/')
        const urlInstance = new URL(
            `superset-gateway/api/${cleanedResource}`,
            baseUrl === '..'
                ? window.location.href.split('dhis-web-dashboard/')[0]
                : `${baseUrl}/`
        )
        return urlInstance.href
    }, [baseUrl, resource])
    return url
}

export const useFetchSupersetBaseUrl = () => {
    const url = useSupersetApiUrl('info')
    const fetchSupersetBaseUrl = useCallback(async () => {
        const response = await fetch(url)
        if (!response.ok) {
            console.error(response)
            throw new Error(
                `Could not fetch info from the superset gateway: STATUS ${response.status}`
            )
        }

        const data = await response.json()
        return data.supersetBaseUrl
    }, [url])

    return fetchSupersetBaseUrl
}

export const usePostSupersetGuestToken = (dashboardId) => {
    const url = useSupersetApiUrl(`guestTokens/dhis2/dashboards/${dashboardId}`)
    const postSupersetGuestToken = useCallback(async () => {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
        })

        if (!response.ok) {
            console.error(response)
            throw new Error(
                `Could not POST guest token to superset gateway: STATUS ${response.status}`
            )
        }

        const data = await response.json()
        return data.token
    }, [url])
    return postSupersetGuestToken
}
