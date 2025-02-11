import { useConfig } from '@dhis2/app-service-config'
import { useCallback, useMemo } from 'react'

/* Since the superset gateway is not part of the DHIS2 Core Web API
 * we need to compute the API URL and use regular fetch requests
 * instead of using the dataEngine. */
const useSupersetGatewayApiUrl = (resource) => {
    const { baseUrl } = useConfig()
    const url = useMemo(() => {
        // Trim slashes from start and end
        const cleanedResource = resource.split('/').filter(Boolean).join('/')
        const urlInstance = new URL(
            `superset-gateway/api/${cleanedResource}`,
            baseUrl === '..'
                ? /* On production instances the baseUrl is a relative URL (..)
                   * To obtain an absolute URL we can read the part of the window
                   * location that preceedes the app-path */
                  window.location.href.split('dhis-web-dashboard/')[0]
                : `${baseUrl}/`
        )
        return urlInstance.href
    }, [baseUrl, resource])
    return url
}

export const useFetchSupersetBaseUrl = () => {
    const url = useSupersetGatewayApiUrl('info')
    // Note that this is an unauthenticated request
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
    const url = useSupersetGatewayApiUrl(
        `guestTokens/dhis2/dashboards/${dashboardId}`
    )
    // This is an authenticated request which relies on the cookie set by DHIS2 Core
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
