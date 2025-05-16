import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { useFetchSupersetBaseUrl } from '../../api/supersetGateway.js'
import { useAsyncCallbackState } from './useAsyncCallbackState.js'

const SYSTEM_SETTINGS_WITH_DEFAULTS = {
    keyDashboardContextMenuItemOpenInRelevantApp: true,
    keyDashboardContextMenuItemShowInterpretationsAndDetails: true,
    keyDashboardContextMenuItemSwitchViewType: true,
    keyDashboardContextMenuItemViewFullscreen: true,
    keyGatherAnalyticalObjectStatisticsInDashboardViews: false,
    startModuleEnableLightweight: false,
    keyEmbeddedDashboardsEnabled: undefined,
    keyHideBiMonthlyPeriods: undefined,
    keyHideBiWeeklyPeriods: undefined,
    keyHideDailyPeriods: undefined,
    keyHideMonthlyPeriods: undefined,
    keyHideWeeklyPeriods: undefined,
}
const SYSTEM_SETTINGS_KEYS = Object.keys(SYSTEM_SETTINGS_WITH_DEFAULTS)

const SYSTEM_SETTINGS_REMAPPINGS = {
    keyDashboardContextMenuItemOpenInRelevantApp: 'allowVisOpenInApp',
    keyDashboardContextMenuItemShowInterpretationsAndDetails:
        'allowVisShowInterpretations',
    keyDashboardContextMenuItemSwitchViewType: 'allowVisViewAs',
    keyDashboardContextMenuItemViewFullscreen: 'allowVisFullscreen',
    keyHideBiMonthlyPeriods: 'hideBiMonthlyPeriods',
    keyHideDailyPeriods: 'hideDailyPeriods',
    keyHideMonthlyPeriods: 'hideMonthlyPeriods',
    keyHideWeeklyPeriods: 'hideWeeklyPeriods',
    keyHideBiWeeklyPeriods: 'hideBiWeeklyPeriods',
    keyEmbeddedDashboardsEnabled: 'embeddedDashboardsEnabled',
}

const transformSystemSettings = (fetchedSettings) =>
    SYSTEM_SETTINGS_KEYS.reduce((cleanedSettings, key) => {
        const remappedKey = SYSTEM_SETTINGS_REMAPPINGS[key] ?? key
        const value = fetchedSettings[key] ?? SYSTEM_SETTINGS_WITH_DEFAULTS[key]
        cleanedSettings[remappedKey] = value
        return cleanedSettings
    }, {})

const systemSettingsQuery = {
    resource: 'systemSettings',
    // This currently does nothing but will help once DHIS2-19606 is done
    params: { key: SYSTEM_SETTINGS_KEYS },
}

export function useSystemSettingsQuery() {
    const engine = useDataEngine()
    const fetchSupersetBaseUrl = useFetchSupersetBaseUrl()
    /* The app could still work if the system settings can't be
     * fetched, because there is default for everything */
    const fetchSystemSettings = useCallback(async () => {
        const systemSettings = await engine
            .query({ systemSettings: systemSettingsQuery })
            .then(({ systemSettings }) => systemSettings)
            .catch(() => ({}))
            .then(transformSystemSettings)

        if (systemSettings.embeddedDashboardsEnabled) {
            try {
                systemSettings.supersetBaseUrl = await fetchSupersetBaseUrl()
            } catch {
                systemSettings.supersetBaseUrl = null
            }
        }
        return systemSettings
    }, [engine, fetchSupersetBaseUrl])

    return useAsyncCallbackState(fetchSystemSettings)
}
