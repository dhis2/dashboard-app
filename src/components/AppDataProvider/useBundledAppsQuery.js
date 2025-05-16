import { useConfig } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { useAsyncCallbackState } from './useAsyncCallbackState.js'

export function useBundledAppsQuery() {
    const { baseUrl } = useConfig()
    const fetchBundledApps = useCallback(async () => {
        const url = new URL(
            'dhis-web-apps/apps-bundle.json',
            baseUrl === '..'
                ? window.location.href.split('dhis-web-dashboard/')[0]
                : `${baseUrl}/`
        )
        const response = await fetch(url.href, {
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error('Fetch response not OK')
        } else {
            const data = await response.json()
            return data
        }
    }, [baseUrl])

    return useAsyncCallbackState(fetchBundledApps)
}
