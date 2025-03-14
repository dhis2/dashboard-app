import { useConfig } from '@dhis2/app-service-config'
import i18n from '@dhis2/d2-i18n'
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
        try {
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`Response from ${url} was not OK`)
            } else {
                const { supersetBaseUrl } = await response.json()
                return supersetBaseUrl
            }
        } catch (error) {
            console.error(error)
            throw new Error(
                i18n.t('Could not get info from Superset gateway endpoint')
            )
        }
    }, [url])

    return fetchSupersetBaseUrl
}

export const usePostSupersetGuestToken = (dashboardId) => {
    const url = useSupersetGatewayApiUrl(
        `guestTokens/dhis2/dashboards/${dashboardId}`
    )
    // This is an authenticated request which relies on the cookie set by DHIS2 Core
    const postSupersetGuestToken = useCallback(async () => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
            })

            if (!response.ok) {
                const { errorCode } = await response.json()
                throw new SupersetGatewayGuestTokenError(dashboardId, errorCode)
            } else {
                const { token } = await response.json()
                return token
            }
        } catch (error) {
            console.error(error)
            if (error instanceof SupersetGatewayGuestTokenError) {
                // Error based on error code in response, so we show a specific localised message
                throw error
            } else {
                // Unexpected error occurred, so we show the default localised message
                throw new SupersetGatewayGuestTokenError(dashboardId)
            }
        }
    }, [dashboardId, url])
    return postSupersetGuestToken
}

class SupersetGatewayGuestTokenError extends Error {
    constructor(dashboardId, errorCode) {
        super(parseMessageForErrorCode(dashboardId, errorCode))
        this.errorCode = errorCode
    }
}

function parseMessageForErrorCode(dashboardId, errorCode) {
    switch (errorCode) {
        case 'E1001':
            return i18n.t(
                'Dashboard with ID "{{dashboardId}}" not found or not accessible',
                { dashboardId }
            )
        case 'E1002':
            return i18n.t(
                'Dashboard with ID "{{dashboardId}}" is not embedded',
                { dashboardId }
            )
        case 'E1003':
            return i18n.t(
                'Embedded provider must be "SUPERSET" for dashboard ID "{{dashboardId}}"',
                { dashboardId }
            )
        case 'E1004':
            return i18n.t(
                'Superset Embed UUID not found for dashboard ID "{{dashboardId}}"',
                { dashboardId }
            )
        case 'E1005':
            return i18n.t(
                'Dashboard with ID "{{dashboardId}}" not found on the Superset service',
                { dashboardId }
            )
        default:
            return i18n.t(
                'Could not get guest token from Superset Gateway for dashboard ID "{{dashboardId}}"',
                { dashboardId }
            )
    }
}
