import { useConfig } from '@dhis2/app-service-config'
import { useCallback, useMemo } from 'react'

export const useFetchSuperSetBaseUrl = () => {
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

    const fetchSuperSetBaseUrl = useCallback(async () => {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const data = await response.json()
        return data.supersetBaseUrl
    }, [url])

    return fetchSuperSetBaseUrl
}
