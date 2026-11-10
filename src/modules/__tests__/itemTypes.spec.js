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

const IDV_SERVER_VERSION = { major: 2, minor: 43, patch: 3 }
const SERVER_VERSION_42 = { major: 2, minor: 42, patch: 0 }
const SERVER_VERSION_41 = { major: 2, minor: 41, patch: 0 }

const BASE_URL = 'https://play.dhis2.org'

describe('version-aware accessors for EVENT_VISUALIZATION', () => {
    it('resolves to the Individual Data Visualizer app from 2.43.3', () => {
        const serverVersion = IDV_SERVER_VERSION

        expect(getAppKey(EVENT_VISUALIZATION, serverVersion)).toBe(
            'individual-data-visualizer'
        )
        expect(getAppName(EVENT_VISUALIZATION, serverVersion)).toBe(
            'Individual Data Visualizer'
        )
        expect(getPluralTitle(EVENT_VISUALIZATION, serverVersion)).toBe(
            'Event visualizations'
        )
    })

    it('resolves to the Line Listing app below 2.43.3', () => {
        expect(getAppKey(EVENT_VISUALIZATION, SERVER_VERSION_42)).toBe(
            'line-listing'
        )
        expect(getAppName(EVENT_VISUALIZATION, SERVER_VERSION_42)).toBe(
            'Line Listing'
        )
        expect(getPluralTitle(EVENT_VISUALIZATION, SERVER_VERSION_42)).toBe(
            'Line lists'
        )
    })

    it('resolves to the Line Listing app when serverVersion is missing', () => {
        // Call sites that forget to pass serverVersion must degrade to the older
        // behaviour rather than claiming the new app is available
        expect(getAppKey(EVENT_VISUALIZATION)).toBe('line-listing')
        expect(getAppName(EVENT_VISUALIZATION)).toBe('Line Listing')
        expect(getPluralTitle(EVENT_VISUALIZATION)).toBe('Line lists')
    })
})

describe('accessors for types without version-dependent values', () => {
    it('returns the same values regardless of serverVersion', () => {
        expect(getAppKey(VISUALIZATION, SERVER_VERSION_42)).toBe(
            'data-visualizer'
        )
        expect(getAppKey(VISUALIZATION, IDV_SERVER_VERSION)).toBe(
            'data-visualizer'
        )
        expect(getAppName(MAP, IDV_SERVER_VERSION)).toBe('Maps')
        expect(getPluralTitle(MAP, IDV_SERVER_VERSION)).toBe('Maps')
    })

    it('returns undefined for a type without an appKey', () => {
        expect(getAppKey(REPORTS, IDV_SERVER_VERSION)).toBeUndefined()
    })

    it('returns an empty string for a type without an appName', () => {
        expect(getAppName(REPORTS, IDV_SERVER_VERSION)).toBe('')
    })

    it('does not throw for an unknown type', () => {
        expect(getAppKey('PONY', IDV_SERVER_VERSION)).toBeUndefined()
        expect(getAppName('PONY', IDV_SERVER_VERSION)).toBe('')
        expect(getPluralTitle('PONY', IDV_SERVER_VERSION)).toBeUndefined()
    })
})

describe('getItemUrl', () => {
    const item = { id: 'rainbowVis' }

    it('forwards serverVersion so EVENT_VISUALIZATION resolves the right app', () => {
        // Regression: serverVersion was previously not forwarded to appUrl, so
        // every caller silently resolved the oldest branch
        expect(
            getItemUrl({
                type: EVENT_VISUALIZATION,
                item,
                baseUrl: BASE_URL,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe(
            `${BASE_URL}/api/apps/individual-data-visualizer/index.html#/rainbowVis`
        )

        expect(
            getItemUrl({
                type: EVENT_VISUALIZATION,
                item,
                baseUrl: BASE_URL,
                serverVersion: SERVER_VERSION_42,
            })
        ).toBe(`${BASE_URL}/dhis-web-line-listing/#/rainbowVis`)

        expect(
            getItemUrl({
                type: EVENT_VISUALIZATION,
                item,
                baseUrl: BASE_URL,
                serverVersion: SERVER_VERSION_41,
            })
        ).toBe(`${BASE_URL}/api/apps/line-listing/index.html#/rainbowVis`)
    })

    it('builds urls for non-versioned types', () => {
        expect(
            getItemUrl({
                type: VISUALIZATION,
                item,
                baseUrl: BASE_URL,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe(`${BASE_URL}/dhis-web-data-visualizer/#/rainbowVis`)

        expect(
            getItemUrl({
                type: RESOURCES,
                item,
                baseUrl: BASE_URL,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe(`${BASE_URL}/api/documents/rainbowVis/data`)
    })

    it('uses the launchUrl for APP items', () => {
        expect(
            getItemUrl({
                type: APP,
                item: { id: 'app', launchUrl: 'https://ponies-r-us.com' },
                baseUrl: BASE_URL,
                serverVersion: IDV_SERVER_VERSION,
            })
        ).toBe('https://ponies-r-us.com')
    })
})
