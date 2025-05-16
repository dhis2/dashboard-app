import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, Layer, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, createContext, useContext } from 'react'
import { useBundledAppsQuery } from './useBundledAppsQuery.js'
import { useSystemSettingsQuery } from './useSystemSettingsQuery.js'

const baseState = {
    loading: false,
    hasError: false,
    data: undefined,
}

const queryDefinition = {
    apps: {
        resource: 'apps',
    },
    rootOrgUnits: {
        resource: 'organisationUnits',
        params: {
            fields: 'id,displayName,name',
            userDataViewFallback: true,
            paging: false,
        },
    },
    currentUser: {
        resource: 'me',
        params: {
            fields: [
                'id',
                'username',
                'displayName~rename(name)',
                'authorities',
                /* Filtering nested properties under `settings` does not actually
                 * work but support for it may be added in DHIS2-19606, so this
                 * code below is forward looking this change. If the issue is not
                 * implemented we can remove the nested fields filter. */
                'settings[keyDbLocale,keyUiLocale,keyAnalysisDisplayProperty]',
            ],
        },
    },
}

const AppDataCtx = createContext({
    apps: [],
    bundledApps: [],
    currentUser: {
        settings: {},
    },
    rootOrgUnits: [],
    systemSettings: {},
})

export default function AppDataProvider({ children }) {
    const dataQueryState = useDataQuery(queryDefinition)
    const bundleAppsQueryState = useBundledAppsQuery()
    const systemSettingsQueryState = useSystemSettingsQuery()
    const { loading, hasError, data } = useMemo(() => {
        const allStates = [
            dataQueryState,
            bundleAppsQueryState,
            systemSettingsQueryState,
        ]

        if (allStates.some(({ loading }) => loading)) {
            return { ...baseState, loading: true }
        }
        if (allStates.some(({ error }) => !!error)) {
            return { ...baseState, hasError: true }
        }

        const userSettings = dataQueryState.data.currentUser.settings
        const data = {
            apps: dataQueryState.data.apps,
            bundledApps: bundleAppsQueryState.data,
            currentUser: {
                ...dataQueryState.data.currentUser,
                // Clean userSetting for instances without DHIS2-19606
                settings: {
                    keyDbLocale: userSettings.keyDbLocale,
                    keyUiLocale: userSettings.keyUiLocale,
                    keyAnalysisDisplayProperty:
                        userSettings.keyAnalysisDisplayProperty,
                    displayProperty:
                        userSettings.keyAnalysisDisplayProperty === 'name'
                            ? 'displayName'
                            : 'displayShortName',
                },
            },
            rootOrgUnits: dataQueryState.data.rootOrgUnits.organisationUnits,
            systemSettings: systemSettingsQueryState.data,
        }
        return { ...baseState, data }
    }, [dataQueryState, bundleAppsQueryState, systemSettingsQueryState])

    if (loading) {
        return (
            <Layer translucent>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </Layer>
        )
    }

    if (hasError) {
        return (
            <NoticeBox error title={i18n.t('Network error')}>
                {i18n.t('Could not load app data')}
            </NoticeBox>
        )
    }

    return <AppDataCtx.Provider value={data}>{children}</AppDataCtx.Provider>
}

AppDataProvider.propTypes = {
    children: PropTypes.node,
}

const useInstalledAppVersion = (appKey) => {
    const { apps, bundledApps } = useContext(AppDataCtx)
    return (
        apps.find((app) => app.key === appKey)?.version ??
        bundledApps.find((app) => app.name === appKey)?.version ??
        '0.0.0'
    )
}

export function useInstalledApps() {
    const { apps } = useContext(AppDataCtx)
    return apps
}
export function useInstalledDVVersion() {
    return useInstalledAppVersion('data-visualizer')
}
export function useInstalledLLVersion() {
    return useInstalledAppVersion('line-listing')
}
export function useInstalledMapsVersion() {
    return useInstalledAppVersion('maps')
}
export function useSystemSettings() {
    const { systemSettings } = useContext(AppDataCtx)
    return systemSettings
}
export function useIsSupersetSupported() {
    const { embeddedDashboardsEnabled, supersetBaseUrl } = useSystemSettings()

    return (
        embeddedDashboardsEnabled &&
        // A populated string if a response was received from the Superset Gateway
        ((typeof supersetBaseUrl === 'string' && supersetBaseUrl.length > 0) ||
            // Or `null` if it was not possible to retreive the baseUrl
            supersetBaseUrl === null)
    )
}
export function useSupersetBaseUrl() {
    const { supersetBaseUrl } = useSystemSettings()
    return supersetBaseUrl ?? null
}
export function useCurrentUser() {
    const { currentUser } = useContext(AppDataCtx)
    return currentUser
}
export function useUserSettings() {
    const { settings } = useCurrentUser()
    return settings
}
export function useRootOrgUnits() {
    const { rootOrgUnits } = useContext(AppDataCtx)
    return rootOrgUnits
}
