import { useConfig } from '@dhis2/app-service-config'

export const useFetchSuperSetBaseUrl = () => {
    const { baseUrl } = useConfig()
    const url = new URL(
        'superset-gateway/api/info',
        baseUrl === '..'
            ? window.location.href.split('dhis-web-dashboard/')[0]
            : `${baseUrl}/`
    )?.href

    return async () => {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const data = await response.json()
        return data.supersetBaseUrl
    }
}
