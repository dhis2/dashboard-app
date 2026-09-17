import { MIN_API_VERSION_FOR_EVER } from '../isAppVersionCompatible.js'
import {
    getAppKey,
    getAppName,
    getPluralTitle,
    getItemUrl,
    APP,
    EVENT_VISUALIZATION,
    MAP,
    REPORTS,
    RESOURCES,
    VISUALIZATION,
} from '../itemTypes.js'

const BASE_URL = 'https://play.dhis2.org'
const BELOW_EVER = MIN_API_VERSION_FOR_EVER - 1

describe('version-aware accessors for EVENT_VISUALIZATION', () => {
    it('resolves to the Event Visualizer app from the minimum api version', () => {
        const apiVersion = MIN_API_VERSION_FOR_EVER

        expect(getAppKey(EVENT_VISUALIZATION, apiVersion)).toBe(
            'individual-data-visualizer'
        )
        expect(getAppName(EVENT_VISUALIZATION, apiVersion)).toBe(
            'Individual Data Visualizer'
        )
        expect(getPluralTitle(EVENT_VISUALIZATION, apiVersion)).toBe(
            'Event visualizations'
        )
    })

    it('resolves to the Line Listing app below the minimum api version', () => {
        expect(getAppKey(EVENT_VISUALIZATION, BELOW_EVER)).toBe('line-listing')
        expect(getAppName(EVENT_VISUALIZATION, BELOW_EVER)).toBe('Line Listing')
        expect(getPluralTitle(EVENT_VISUALIZATION, BELOW_EVER)).toBe(
            'Line lists'
        )
    })

    it('resolves to the Line Listing app when apiVersion is missing', () => {
        // Call sites that forget to pass apiVersion must degrade to the older
        // behaviour rather than claiming the new app is available
        expect(getAppKey(EVENT_VISUALIZATION)).toBe('line-listing')
        expect(getAppName(EVENT_VISUALIZATION)).toBe('Line Listing')
        expect(getPluralTitle(EVENT_VISUALIZATION)).toBe('Line lists')
    })
})

describe('accessors for types without version-dependent values', () => {
    it('returns the same values regardless of apiVersion', () => {
        expect(getAppKey(VISUALIZATION, BELOW_EVER)).toBe('data-visualizer')
        expect(getAppKey(VISUALIZATION, MIN_API_VERSION_FOR_EVER)).toBe(
            'data-visualizer'
        )
        expect(getAppName(MAP, MIN_API_VERSION_FOR_EVER)).toBe('Maps')
        expect(getPluralTitle(MAP, MIN_API_VERSION_FOR_EVER)).toBe('Maps')
    })

    it('returns undefined for a type without an appKey', () => {
        expect(getAppKey(REPORTS, MIN_API_VERSION_FOR_EVER)).toBeUndefined()
    })

    it('returns an empty string for a type without an appName', () => {
        expect(getAppName(REPORTS, MIN_API_VERSION_FOR_EVER)).toBe('')
    })

    it('does not throw for an unknown type', () => {
        expect(getAppKey('PONY', MIN_API_VERSION_FOR_EVER)).toBeUndefined()
        expect(getAppName('PONY', MIN_API_VERSION_FOR_EVER)).toBe('')
        expect(getPluralTitle('PONY', MIN_API_VERSION_FOR_EVER)).toBeUndefined()
    })
})

describe('getItemUrl', () => {
    const item = { id: 'rainbowVis' }

    it('forwards apiVersion so EVENT_VISUALIZATION resolves the right app', () => {
        // Regression: apiVersion was previously not forwarded to appUrl, so
        // every caller silently resolved the oldest branch
        expect(
            getItemUrl({
                type: EVENT_VISUALIZATION,
                item,
                baseUrl: BASE_URL,
                apiVersion: MIN_API_VERSION_FOR_EVER,
            })
        ).toBe(
            `${BASE_URL}/api/apps/individual-data-visualizer/index.html#/rainbowVis`
        )

        expect(
            getItemUrl({
                type: EVENT_VISUALIZATION,
                item,
                baseUrl: BASE_URL,
                apiVersion: 42,
            })
        ).toBe(`${BASE_URL}/dhis-web-line-listing/#/rainbowVis`)

        expect(
            getItemUrl({
                type: EVENT_VISUALIZATION,
                item,
                baseUrl: BASE_URL,
                apiVersion: 41,
            })
        ).toBe(`${BASE_URL}/api/apps/line-listing/index.html#/rainbowVis`)
    })

    it('builds urls for non-versioned types', () => {
        expect(
            getItemUrl({
                type: VISUALIZATION,
                item,
                baseUrl: BASE_URL,
                apiVersion: MIN_API_VERSION_FOR_EVER,
            })
        ).toBe(`${BASE_URL}/dhis-web-data-visualizer/#/rainbowVis`)

        expect(
            getItemUrl({
                type: RESOURCES,
                item,
                baseUrl: BASE_URL,
                apiVersion: MIN_API_VERSION_FOR_EVER,
            })
        ).toBe(`${BASE_URL}/api/documents/rainbowVis/data`)
    })

    it('uses the launchUrl for APP items', () => {
        expect(
            getItemUrl({
                type: APP,
                item: { id: 'app', launchUrl: 'https://ponies-r-us.com' },
                baseUrl: BASE_URL,
                apiVersion: MIN_API_VERSION_FOR_EVER,
            })
        ).toBe('https://ponies-r-us.com')
    })
})
