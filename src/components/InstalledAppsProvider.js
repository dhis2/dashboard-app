import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, Layer, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, {
    useContext,
    useEffect,
    useReducer,
    createContext,
    useMemo,
    useCallback,
} from 'react'

export const InstalledAppsCtx = createContext({
    apps: [],
    bundledApps: [],
})

const DV_APP_KEY = 'data-visualizer'
const LL_APP_KEY = 'line-listing'
const MAPS_APP_KEY = 'maps'

const findAppVersion = (apps, bundledApps, appKey) =>
    apps.find((app) => app.key === appKey)?.version ||
    bundledApps.find((app) => app.name === appKey)?.version ||
    '0.0.0'

const LOADING = 'LOADING'
const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

const initialState = {
    loading: false,
    error: undefined,
    data: undefined,
}

const reducer = (state, action) => {
    switch (action.type) {
        case LOADING:
            return { ...initialState, loading: true }
        case SUCCESS:
            return { ...initialState, data: action.payload }
        case ERROR:
            return { ...initialState, error: action.payload }
        default:
            return state
    }
}

const appsQueryDefinition = {
    apps: {
        resource: 'apps',
    },
}

const useBundledAppsQuery = () => {
    const { baseUrl } = useConfig()
    const [{ loading, error, data }, dispatch] = useReducer(
        reducer,
        initialState
    )
    const url = useMemo(
        () =>
            new URL(
                'dhis-web-apps/apps-bundle.json',
                baseUrl === '..'
                    ? window.location.href.split('dhis-web-dashboard/')[0]
                    : `${baseUrl}/`
            ),
        [baseUrl]
    )
    const fetchBundledApps = useCallback(async () => {
        dispatch({ type: LOADING })

        try {
            const response = await fetch(url.href, {
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error('Fetch response not OK')
            } else {
                const data = await response.json()

                dispatch({ type: SUCCESS, payload: data })
            }
        } catch (error) {
            console.error(error)

            const localisedError = new Error(
                i18n.t('Could not fetch bundled apps')
            )

            dispatch({ type: ERROR, payload: localisedError })
        }
    }, [url])

    useEffect(() => {
        if (!loading && !error && !data) {
            fetchBundledApps()
        }
    }, [loading, error, data, fetchBundledApps])

    return {
        loading,
        error,
        data,
    }
}

const InstalledAppsProvider = ({ children }) => {
    const appsQuery = useDataQuery(appsQueryDefinition)
    const bundledAppsQuery = useBundledAppsQuery()
    const loading = appsQuery.loading || bundledAppsQuery.loading
    const error = appsQuery.error || bundledAppsQuery.error

    const installedAppsData = useMemo(
        () => ({
            apps: appsQuery.data?.apps,
            bundledApps: bundledAppsQuery.data,
        }),
        [appsQuery.data, bundledAppsQuery.data]
    )

    if (loading) {
        return (
            <Layer translucent>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </Layer>
        )
    }

    if (error) {
        return (
            <NoticeBox error title={i18n.t('Network error')}>
                {error}
            </NoticeBox>
        )
    }

    return (
        <InstalledAppsCtx.Provider value={installedAppsData}>
            {children}
        </InstalledAppsCtx.Provider>
    )
}

InstalledAppsProvider.propTypes = {
    children: PropTypes.node,
}

const useInstalledAppVersion = (key) => {
    const { apps, bundledApps } = useContext(InstalledAppsCtx)
    return findAppVersion(apps, bundledApps, key)
}

export default InstalledAppsProvider

export const useInstalledApps = () => {
    const { apps } = useContext(InstalledAppsCtx)
    return apps
}
export const useInstalledDVVersion = () => useInstalledAppVersion(DV_APP_KEY)
export const useInstalledLLVersion = () => useInstalledAppVersion(LL_APP_KEY)
export const useInstalledMapsVersion = () =>
    useInstalledAppVersion(MAPS_APP_KEY)
