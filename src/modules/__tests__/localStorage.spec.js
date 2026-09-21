import { getNavigationTab, storeNavigationTab } from '../localStorage.js'
import { NAV_TABS } from '../navigationTabs.js'

describe('navigation tab preference', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('returns the All tab when nothing is stored', () => {
        expect(getNavigationTab('rainbowdash')).toBe(NAV_TABS.ALL)
    })

    it('round-trips a stored tab', () => {
        storeNavigationTab('rainbowdash', NAV_TABS.MINE)

        expect(getNavigationTab('rainbowdash')).toBe(NAV_TABS.MINE)
    })

    it('keeps tab preferences separate per user on a shared computer', () => {
        storeNavigationTab('rainbowdash', NAV_TABS.MINE)
        storeNavigationTab('applejack', NAV_TABS.STARRED)

        expect(getNavigationTab('rainbowdash')).toBe(NAV_TABS.MINE)
        expect(getNavigationTab('applejack')).toBe(NAV_TABS.STARRED)
    })

    it('falls back to All when the stored value is not a known tab', () => {
        localStorage.setItem('dhis2.dashboard.navTab.rainbowdash', 'bogus')

        expect(getNavigationTab('rainbowdash')).toBe(NAV_TABS.ALL)
    })

    it('does not throw when localStorage.setItem fails', () => {
        const setItem = jest
            .spyOn(Storage.prototype, 'setItem')
            .mockImplementation(() => {
                throw new Error('quota exceeded')
            })

        expect(() =>
            storeNavigationTab('rainbowdash', NAV_TABS.MINE)
        ).not.toThrow()

        setItem.mockRestore()
    })
})
