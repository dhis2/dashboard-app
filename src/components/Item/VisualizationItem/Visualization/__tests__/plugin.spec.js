import { MIN_API_VERSION_FOR_EVER } from '../../../../../modules/isAppVersionCompatible.js'
import {
    VISUALIZATION,
    REPORT_TABLE,
    CHART,
    MAP,
    EVENT_REPORT,
    EVENT_CHART,
    EVENT_VISUALIZATION,
} from '../../../../../modules/itemTypes.js'
import { getPluginLaunchUrl, hasStandalonePlugin } from '../plugin.js'

const BASE_URL = 'https://play.dhis2.org'
const BELOW = MIN_API_VERSION_FOR_EVER - 1

describe('hasStandalonePlugin', () => {
    it('is true for EVENT_VISUALIZATION from the minimum api version', () => {
        expect(
            hasStandalonePlugin(EVENT_VISUALIZATION, MIN_API_VERSION_FOR_EVER)
        ).toBe(true)
        expect(
            hasStandalonePlugin(
                EVENT_VISUALIZATION,
                MIN_API_VERSION_FOR_EVER + 1
            )
        ).toBe(true)
    })

    it('is false for EVENT_VISUALIZATION below the minimum api version', () => {
        expect(hasStandalonePlugin(EVENT_VISUALIZATION, BELOW)).toBe(false)
    })

    it('is false when apiVersion is missing', () => {
        // Guards against call sites forgetting to pass apiVersion, which would
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
            expect(hasStandalonePlugin(type, MIN_API_VERSION_FOR_EVER)).toBe(
                false
            )
        })
    })

    it('is false for an unknown type', () => {
        expect(hasStandalonePlugin('PONY', MIN_API_VERSION_FOR_EVER)).toBe(
            false
        )
    })

    it('is false when passed an item instead of an item type', () => {
        // The map is keyed by type string; an object stringifies to a key that
        // never matches, so this must not be mistaken for a standalone plugin
        expect(
            hasStandalonePlugin(
                { type: EVENT_VISUALIZATION },
                MIN_API_VERSION_FOR_EVER
            )
        ).toBe(false)
    })
})

describe('getPluginLaunchUrl', () => {
    const everApp = {
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

    it('resolves EVENT_VISUALIZATION to the Event Visualizer app from api version 43', () => {
        expect(
            getPluginLaunchUrl({
                type: EVENT_VISUALIZATION,
                apps: [everApp, lineListingApp],
                baseUrl: BASE_URL,
                apiVersion: MIN_API_VERSION_FOR_EVER,
            })
        ).toBe(everApp.pluginLaunchUrl)
    })

    it('resolves EVENT_VISUALIZATION to the Line Listing app below api version 43', () => {
        expect(
            getPluginLaunchUrl({
                type: EVENT_VISUALIZATION,
                apps: [everApp, lineListingApp],
                baseUrl: BASE_URL,
                apiVersion: BELOW,
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
                apiVersion: MIN_API_VERSION_FOR_EVER,
            })
        ).toBe(installed.pluginLaunchUrl)
    })

    it('falls back to the bundled path for integrated plugins', () => {
        expect(
            getPluginLaunchUrl({
                type: VISUALIZATION,
                apps: [],
                baseUrl: BASE_URL,
                apiVersion: MIN_API_VERSION_FOR_EVER,
            })
        ).toBe(`${BASE_URL}/dhis-web-data-visualizer/plugin.html`)

        expect(
            getPluginLaunchUrl({
                type: MAP,
                apps: [],
                baseUrl: BASE_URL,
                apiVersion: MIN_API_VERSION_FOR_EVER,
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
                apiVersion: MIN_API_VERSION_FOR_EVER,
            })
        ).toBeUndefined()
    })

    it('returns undefined for types with neither an appKey nor a bundled path', () => {
        expect(
            getPluginLaunchUrl({
                type: EVENT_REPORT,
                apps: [],
                baseUrl: BASE_URL,
                apiVersion: MIN_API_VERSION_FOR_EVER,
            })
        ).toBeUndefined()
    })
})
