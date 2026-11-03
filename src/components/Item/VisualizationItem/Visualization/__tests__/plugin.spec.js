import {
    APP,
    VISUALIZATION,
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    EVENT_VISUALIZATION,
} from '../../../../../modules/itemTypes.js'
import {
    getPluginLaunchUrl,
    hasPluginAccess,
    hasStandalonePlugin,
    isPluginAppListed,
    pluginIsAvailable,
} from '../plugin.js'

const IDV_SERVER_VERSION = { major: 2, minor: 43, patch: 3 }
const SERVER_VERSION_42 = { major: 2, minor: 42, patch: 0 }

const BASE_URL = 'https://play.dhis2.org'

describe('hasStandalonePlugin', () => {
    it('is true for EVENT_VISUALIZATION from 2.43.3', () => {
        expect(
            hasStandalonePlugin(EVENT_VISUALIZATION, IDV_SERVER_VERSION)
        ).toBe(true)
        expect(
            hasStandalonePlugin(EVENT_VISUALIZATION, {
                major: 2,
                minor: 44,
                patch: 0,
            })
        ).toBe(true)
    })

    it('is false for EVENT_VISUALIZATION below 2.43.3', () => {
        expect(
            hasStandalonePlugin(EVENT_VISUALIZATION, SERVER_VERSION_42)
        ).toBe(false)
    })

    it('is false when serverVersion is missing', () => {
        // Guards against call sites forgetting to pass serverVersion, which would
        // otherwise silently opt every item into the non-standalone path
        expect(hasStandalonePlugin(EVENT_VISUALIZATION, undefined)).toBe(false)
    })

    it('is false for types that are not standalone', () => {
        ;[
            VISUALIZATION,
            REPORT_TABLE,
            CHART,
            MAP,
            EVENT_REPORT,
            EVENT_CHART,
        ].forEach((type) => {
            expect(hasStandalonePlugin(type, IDV_SERVER_VERSION)).toBe(false)
        })
    })

    it('is false for an unknown type', () => {
        expect(hasStandalonePlugin('PONY', IDV_SERVER_VERSION)).toBe(false)
    })

    it('is false when passed an item instead of an item type', () => {
        // The map is keyed by type string; an object stringifies to a key that
        // never matches, so this must not be mistaken for a standalone plugin
        expect(
            hasStandalonePlugin(
                { type: EVENT_VISUALIZATION },
                IDV_SERVER_VERSION
            )
        ).toBe(false)
    })
})

describe('getPluginLaunchUrl', () => {
    const idvApp = {
        key: 'individual-data-visualizer',
        pluginLaunchUrl: `${BASE_URL}/api/apps/individual-data-visualizer/plugin.html`,
    }
    const lineListingApp = {
        key: 'line-listing',
        pluginLaunchUrl: `${BASE_URL}/dhis-web-line-listing/plugin.html`,
    }
    const dataVisualizerApp = {
        key: 'data-visualizer',
        pluginLaunchUrl: `${BASE_URL}/dhis-web-data-visualizer/plugin.html`,
    }

    it('resolves EVENT_VISUALIZATION to the Individual Data Visualizer app from 2.43.3', () => {
        expect(
            getPluginLaunchUrl({
                type: EVENT_VISUALIZATION,
                apps: [idvApp, lineListingApp],
                baseUrl: BASE_URL,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe(idvApp.pluginLaunchUrl)
    })

    it('resolves EVENT_VISUALIZATION to the Line Listing app below 2.43.3', () => {
        expect(
            getPluginLaunchUrl({
                type: EVENT_VISUALIZATION,
                apps: [idvApp, lineListingApp],
                baseUrl: BASE_URL,
                serverVersion: SERVER_VERSION_42,
            })
        ).toBe(lineListingApp.pluginLaunchUrl)
    })

    it('prefers the installed app over the hardcoded bundled path', () => {
        const installed = {
            key: 'data-visualizer',
            pluginLaunchUrl: 'https://localhost:3000/plugin.html',
        }

        expect(
            getPluginLaunchUrl({
                type: VISUALIZATION,
                apps: [installed],
                baseUrl: BASE_URL,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe(installed.pluginLaunchUrl)
    })

    it('falls back to the bundled path for integrated plugins', () => {
        expect(
            getPluginLaunchUrl({
                type: VISUALIZATION,
                apps: [],
                baseUrl: BASE_URL,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe(`${BASE_URL}/dhis-web-data-visualizer/plugin.html`)

        expect(
            getPluginLaunchUrl({
                type: MAP,
                apps: [],
                baseUrl: BASE_URL,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe(`${BASE_URL}/dhis-web-maps/plugin.html`)
    })

    it('returns undefined for EVENT_VISUALIZATION when the app is not installed', () => {
        // There is no bundled fallback for this type, so a missing app must
        // surface as missing-plugin rather than a broken URL
        expect(
            getPluginLaunchUrl({
                type: EVENT_VISUALIZATION,
                apps: [dataVisualizerApp],
                baseUrl: BASE_URL,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBeUndefined()
    })

    it('returns undefined for types with neither an appKey nor a bundled path', () => {
        expect(
            getPluginLaunchUrl({
                type: EVENT_REPORT,
                apps: [],
                baseUrl: BASE_URL,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBeUndefined()
    })
})

describe('hasPluginAccess', () => {
    test.each([CHART, REPORT_TABLE, VISUALIZATION])(
        'denies access to %s without the Data Visualizer authority',
        (type) => {
            expect(hasPluginAccess(type, ['M_dhis-web-maps'])).toBe(false)
        }
    )

    test.each([CHART, REPORT_TABLE, VISUALIZATION])(
        'grants access to %s with the Data Visualizer authority',
        (type) => {
            expect(hasPluginAccess(type, ['M_dhis-web-data-visualizer'])).toBe(
                true
            )
        }
    )

    test('denies access to MAP without the Maps authority', () => {
        expect(hasPluginAccess(MAP, ['M_dhis-web-data-visualizer'])).toBe(false)
    })

    test('grants access to MAP with the Maps authority', () => {
        expect(hasPluginAccess(MAP, ['M_dhis-web-maps'])).toBe(true)
    })

    test.each([
        [EVENT_REPORT, 'M_dhis-web-event-reports'],
        [EVENT_CHART, 'M_dhis-web-event-visualizer'],
    ])('checks the app authority for %s', (type, authority) => {
        expect(hasPluginAccess(type, [authority])).toBe(true)
        expect(hasPluginAccess(type, ['M_dhis-web-data-visualizer'])).toBe(
            false
        )
    })

    test.each([VISUALIZATION, MAP, EVENT_REPORT])(
        'grants access to %s with the ALL authority',
        (type) => {
            expect(hasPluginAccess(type, ['ALL'])).toBe(true)
        }
    )

    test.each([VISUALIZATION, MAP])(
        'grants access to %s with the app management authority',
        (type) => {
            expect(hasPluginAccess(type, ['M_dhis-web-app-management'])).toBe(
                true
            )
        }
    )

    test('denies access when authorities are missing', () => {
        expect(hasPluginAccess(VISUALIZATION)).toBe(false)
    })

    test.each([
        [EVENT_VISUALIZATION, 'M_linelisting'],
        [EVENT_VISUALIZATION, 'M_dhis-web-line-listing'],
    ])('grants access to %s with the %s authority', (type, authority) => {
        expect(hasPluginAccess(type, [authority])).toBe(true)
        expect(hasPluginAccess(type, ['M_dhis-web-data-visualizer'])).toBe(
            false
        )
    })

    test('checks the Individual Data Visualizer app for EVENT_VISUALIZATION from 2.43.3', () => {
        expect(
            hasPluginAccess(
                EVENT_VISUALIZATION,
                ['M_dhis-web-line-listing'],
                IDV_SERVER_VERSION
            )
        ).toBe(false)
        expect(
            hasPluginAccess(EVENT_VISUALIZATION, ['ALL'], IDV_SERVER_VERSION)
        ).toBe(true)
    })

    test('does not check authorities for APP', () => {
        expect(hasPluginAccess(APP, [])).toBe(true)
    })
})

describe('pluginIsAvailable', () => {
    // loadPlugin checks the availability without the installed apps
    test.each([EVENT_REPORT, EVENT_CHART])(
        'is true for %s without the installed apps',
        (type) => {
            expect(pluginIsAvailable({ type })).toBe(true)
        }
    )
})

describe('isPluginAppListed', () => {
    const lineListingApp = { key: 'line-listing' }
    const idvApp = { key: 'individual-data-visualizer' }

    test('is true for EVENT_VISUALIZATION when Line Listing is listed below 2.43.3', () => {
        expect(
            isPluginAppListed({
                type: EVENT_VISUALIZATION,
                apps: [lineListingApp],
                serverVersion: SERVER_VERSION_42,
            })
        ).toBe(true)
    })

    test('is true for EVENT_VISUALIZATION when Individual Data Visualizer is listed from 2.43.3', () => {
        expect(
            isPluginAppListed({
                type: EVENT_VISUALIZATION,
                apps: [idvApp],
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe(true)
    })

    test('is false for EVENT_VISUALIZATION when only the app for the other server version is listed', () => {
        expect(
            isPluginAppListed({
                type: EVENT_VISUALIZATION,
                apps: [lineListingApp],
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe(false)
        expect(
            isPluginAppListed({
                type: EVENT_VISUALIZATION,
                apps: [idvApp],
                serverVersion: SERVER_VERSION_42,
            })
        ).toBe(false)
    })

    test('is false when the apps are missing', () => {
        expect(
            isPluginAppListed({
                type: EVENT_VISUALIZATION,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe(false)
    })

    test('is false for types without an app key', () => {
        expect(
            isPluginAppListed({ type: APP, apps: [{ key: undefined }] })
        ).toBe(false)
    })
})
