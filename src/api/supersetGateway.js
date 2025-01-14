import { useConfig } from '@dhis2/app-service-config'
import { useCallback, useMemo } from 'react'

export const useFetchSupersetBaseUrl = () => {
    const { baseUrl } = useConfig()
    const url = useMemo(
        () =>
            new URL(
                'superset-gateway/api/info',
                baseUrl === '..'
                    ? window.location.href.split('dhis-web-dashboard/')[0]
                    : `${baseUrl}/`
            )?.href,
        [baseUrl]
    )

    const fetchSupersetBaseUrl = useCallback(async () => {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(
                `Could not fetch info from the superset gateway: STATUS ${response.status}`
            )
        }

        const data = await response.json()
        return data.supersetBaseUrl
    }, [url])

    return fetchSupersetBaseUrl
}
