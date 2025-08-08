import {
    itemMenuButtonSel,
    titleInputSel,
    confirmActionDialogSel,
    clickEditActionButton,
    itemSearchSel,
    closeModal,
    newButtonSel,
    getViewActionButton,
    clickViewActionButton,
    dashboardTitleSel,
    dashboardChipSel,
    dashboardDescriptionSel,
    // getSharingDialogUserSearch,
} from '../elements/index.js'
import {
    EXTENDED_TIMEOUT,
    goOnline,
    goOffline,
    createDashboardTitle,
} from '../support/utils.js'

// NB: localStorage is cleared between each test, which causes caches to be
// cleared according to the `clearSensitiveCaches` function from the
// platform. Because of this, dashboards must be cached in each test that
// requires a cached dashboard

const CACHED = 'cached'
const UNCACHED = 'uncached'

const OFFLINE_DATA_LAST_UPDATED_TEXT = 'Offline data last updated'
const CACHED_DASHBOARD_ITEM_NAME = 'ANC: 1 and 3 coverage Yearly'
const UNCACHED_DASHBOARD_ITEM_NAME = 'ANC: 1-3 trend lines last 12 months'
const MAKE_AVAILABLE_OFFLINE_TEXT = 'Make available offline'

const UNCACHED_DASHBOARD_TITLE = createDashboardTitle('aa un')
const CACHED_DASHBOARD_TITLE = createDashboardTitle('aa ca')

const createDashboard = (cacheState) => {
    const cachedDashboard = cacheState === CACHED
    cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
    cy.get(titleInputSel, EXTENDED_TIMEOUT).should('be.visible')

    const title = cachedDashboard
        ? CACHED_DASHBOARD_TITLE
        : UNCACHED_DASHBOARD_TITLE

    cy.get(titleInputSel, EXTENDED_TIMEOUT).type(title)
    cy.get('[data-test="item-search"]').click()
    if (cachedDashboard) {
        cy.get(`[data-test="menu-item-${CACHED_DASHBOARD_ITEM_NAME}"]`).click()
    } else {
        cy.get(
            `[data-test="menu-item-${UNCACHED_DASHBOARD_ITEM_NAME}"]`
        ).click()
    }

    closeModal()
    clickEditActionButton('Save changes')
    cy.get(dashboardTitleSel, EXTENDED_TIMEOUT).should('be.visible')
}

const openDashboard = (title) => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()
    checkDashboardIsVisible(title)
}

const checkDashboardIsVisible = (title) => {
    cy.get(dashboardTitleSel).contains(title).should('be.visible')
}

const openAndCacheDashboard = (title) => {
    openDashboard(title)
    clickViewActionButton('More')
    cy.contains(MAKE_AVAILABLE_OFFLINE_TEXT, EXTENDED_TIMEOUT).click()
    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT, EXTENDED_TIMEOUT).should(
        'be.visible'
    )
}

const enterEditMode = () => {
    clickViewActionButton('Edit')
    cy.get(titleInputSel, EXTENDED_TIMEOUT).should('be.visible')
}

const assertCorrectMoreOptions = (cacheState) => {
    clickViewActionButton('More')
    if (cacheState === CACHED) {
        cy.contains('Remove from offline storage').should('be.visible')
        cy.contains('Sync offline data now').should('be.visible')
        cy.contains(MAKE_AVAILABLE_OFFLINE_TEXT).should('not.exist')
    } else {
        cy.contains('Remove from offline storage').should('not.exist')
        cy.contains('Sync offline data now').should('not.exist')
        cy.contains(MAKE_AVAILABLE_OFFLINE_TEXT).should('be.visible')
    }
}

const assertCorrectMoreOptionsEnabledState = (online, cacheState) => {
    clickViewActionButton('More')
    if (online) {
        cy.contains('li', 'Star dashboard').should('not.have.class', 'disabled')
        cy.contains('li', 'Show description').should(
            'not.have.class',
            'disabled'
        )
        cy.contains('li', 'Print').should('not.have.class', 'disabled')
    } else {
        cy.contains('li', 'Star dashboard').should('have.class', 'disabled')
        cy.contains('li', 'Show description').should(
            'not.have.class',
            'disabled'
        )
        if (cacheState === CACHED) {
            cy.contains('li', 'Print').should('not.have.class', 'disabled')
        } else {
            cy.contains('li', 'Print').should('have.class', 'disabled')
        }
    }
    closeModal()
}

const deleteDashboard = (dashboardTitle) => {
    openDashboard(dashboardTitle)
    enterEditMode()
    clickEditActionButton('Delete')
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
    cy.get(dashboardTitleSel).should('be.visible')
}

const goOfflineAndConfirm = () => {
    goOffline()
    cy.getByDataTest('headerbar-online-status')
        .contains('Offline')
        .should('be.visible')
    cy.getByDataTest('headerbar-online-status')
        .contains('Online')
        .should('not.exist')
}

const goOnlineAndConfirm = () => {
    goOnline()
    cy.getByDataTest('headerbar-online-status')
        .contains('Online')
        .should('be.visible')
    cy.getByDataTest('headerbar-online-status')
        .contains('Offline')
        .should('not.exist')
}

const assertEditActionsStateWhenOffline = () => {
    cy.contains('Save changes').should('be.disabled')
    cy.contains('Print preview').should('be.disabled')
    cy.contains('Filter settings').should('be.disabled')
    cy.contains('Translate').should('be.disabled')
    cy.contains('Delete').should('be.disabled')
    cy.contains('Exit without saving').should('not.be.disabled')

    cy.contains('Change layout').should('be.disabled')
    cy.get(itemSearchSel).find('input').should('have.class', 'disabled')
}

const assertEditActionsStateWhenOnline = () => {
    cy.contains('Save changes').should('be.enabled')
    cy.contains('Print preview').should('be.enabled')
    cy.contains('Filter settings').should('be.enabled')
    cy.contains('Translate').should('be.enabled')
    cy.contains('Delete').should('be.enabled')
    cy.contains('Exit without saving').should('be.enabled')

    cy.contains('Change layout').should('be.enabled')
    cy.get(itemSearchSel).find('input').should('not.have.class', 'disabled')
}

describe.skip('Offline dashboard tests', () => {
    beforeEach(() => {
        cy.visit('/')
        goOnline() // Ensure we start online
    })

    it('I am online with a cached dashboard when I lose connectivity', () => {
        // Create dashboards first
        createDashboard(UNCACHED)
        createDashboard(CACHED)

        // Given I open and cache a dashboard
        openAndCacheDashboard(CACHED_DASHBOARD_TITLE)

        // Then the cached dashboard options are available
        assertCorrectMoreOptions(CACHED)
        closeModal()

        // When connectivity is turned off
        goOfflineAndConfirm()

        // Then all actions for "cached" dashboard requiring connectivity are disabled
        cy.get(newButtonSel).should('be.disabled')
        getViewActionButton('Edit').should('be.disabled')
        getViewActionButton('Share').should('be.disabled')
        getViewActionButton('Filter').should('be.disabled')
        getViewActionButton('More').should('be.enabled')

        assertCorrectMoreOptionsEnabledState(false, CACHED)

        // Check item context menu
        cy.get(itemMenuButtonSel, EXTENDED_TIMEOUT).click()
        cy.contains('li', 'View as').should('have.class', 'disabled')
        cy.contains('li', 'Open in Data Visualizer app').should(
            'not.have.class',
            'disabled'
        )
        cy.contains('li', 'Show details and interpretations').should(
            'have.class',
            'disabled'
        )
        cy.contains('li', 'View fullscreen').should(
            'not.have.class',
            'disabled'
        )
        closeModal()
    })

    it('I am offline and switch from a cached dashboard to an uncached dashboard', () => {
        openAndCacheDashboard(CACHED_DASHBOARD_TITLE)

        // And connectivity is turned off
        goOfflineAndConfirm()

        // When I click to open an uncached dashboard when offline
        cy.get(dashboardChipSel, EXTENDED_TIMEOUT)
            .contains(UNCACHED_DASHBOARD_TITLE)
            .click()

        // Then the dashboard is not available and offline message is displayed
        cy.get(dashboardTitleSel).should('not.exist')
        cy.contains('This dashboard cannot be loaded while offline').should(
            'be.visible'
        )
    })

    it('I am offline and switch to a cached dashboard', () => {
        // Given I open and cache a dashboard
        openAndCacheDashboard(CACHED_DASHBOARD_TITLE)

        // Given I open an uncached dashboard
        openDashboard(UNCACHED_DASHBOARD_TITLE)
        cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')

        // And connectivity is turned off
        goOfflineAndConfirm()

        // When I click to open a cached dashboard when offline
        openDashboard(CACHED_DASHBOARD_TITLE)

        // Then the cached dashboard is loaded and displayed in view mode
        checkDashboardIsVisible(CACHED_DASHBOARD_TITLE)
        cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('be.visible')
        cy.contains(CACHED_DASHBOARD_ITEM_NAME).should('be.visible')

        // Check for the cached icon
    })

    it('I am offline and switch to an uncached dashboard and then connectivity is restored', () => {
        // Given I open and cache a dashboard
        openAndCacheDashboard(CACHED_DASHBOARD_TITLE)

        // And connectivity is turned off
        goOfflineAndConfirm()

        // When I click to open an uncached dashboard when offline
        cy.get(dashboardChipSel, EXTENDED_TIMEOUT)
            .contains(UNCACHED_DASHBOARD_TITLE)
            .click()

        // Then the dashboard is not available and offline message is displayed
        cy.get(dashboardTitleSel).should('not.exist')
        cy.contains('This dashboard cannot be loaded while offline').should(
            'be.visible'
        )

        // When connectivity is turned on
        goOnlineAndConfirm()

        // Then the uncached dashboard is loaded and displayed in view mode
        checkDashboardIsVisible(UNCACHED_DASHBOARD_TITLE)
        cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')
        cy.contains(UNCACHED_DASHBOARD_ITEM_NAME).should('be.visible')
    })

    it('I am in edit mode on an uncached dashboard when I lose connectivity and then I exit without saving and then connectivity is restored', () => {
        openDashboard(UNCACHED_DASHBOARD_TITLE)
        enterEditMode()

        // When connectivity is turned off
        goOfflineAndConfirm()

        // Then all edit actions requiring connectivity are disabled
        assertEditActionsStateWhenOffline()

        // When I click Exit without saving
        cy.contains('Exit without saving').click()

        // Then the dashboard is not available and offline message is displayed
        cy.get(dashboardTitleSel).should('not.exist')
        cy.contains('This dashboard cannot be loaded while offline').should(
            'be.visible'
        )

        // When connectivity is turned on
        goOnlineAndConfirm()

        // Then the uncached dashboard is loaded and displayed in view mode
        checkDashboardIsVisible(UNCACHED_DASHBOARD_TITLE)
        cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')
        cy.contains(UNCACHED_DASHBOARD_ITEM_NAME).should('be.visible')
    })

    it('I am in edit mode on a cached dashboard when I lose connectivity and then I exit without saving', () => {
        openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
        enterEditMode()

        // When connectivity is turned off
        goOfflineAndConfirm()

        // Then all edit actions requiring connectivity are disabled
        assertEditActionsStateWhenOffline()

        // When I click Exit without saving
        cy.contains('Exit without saving').click()

        // Then the cached dashboard is loaded and displayed in view mode
        checkDashboardIsVisible(CACHED_DASHBOARD_TITLE)
        cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('be.visible')
        cy.contains(CACHED_DASHBOARD_ITEM_NAME).should('be.visible')
    })

    it('I am in edit mode when I lose connectivity and then connectivity is restored', () => {
        openDashboard(UNCACHED_DASHBOARD_TITLE)
        enterEditMode()

        // When connectivity is turned off
        goOfflineAndConfirm()

        // Then all edit actions requiring connectivity are disabled
        assertEditActionsStateWhenOffline()

        // When connectivity is turned on
        goOnlineAndConfirm()

        // Then all edit actions requiring connectivity are enabled
        assertEditActionsStateWhenOnline()
    })

    it('I remove a dashboard from cache while offline', () => {
        openAndCacheDashboard(CACHED_DASHBOARD_TITLE)

        // And connectivity is turned off
        goOfflineAndConfirm()

        // When I click to Remove from offline storage
        clickViewActionButton('More')
        cy.contains('Remove from offline storage').click()

        // Then the dashboard is not cached
        cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')

        // Assert the cached icon is not displayed

        // When connectivity is turned on
        goOnlineAndConfirm()

        // Then I cache one of the dashboards
        openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
    })

    it('The interpretations panel is open when connectivity is lost', () => {
        openAndCacheDashboard(CACHED_DASHBOARD_TITLE)

        // And I open the interpretations panel
        cy.get(itemMenuButtonSel, EXTENDED_TIMEOUT).click()
        cy.contains('Show details and interpretations').click()
        cy.get('[placeholder="Write an interpretation"]').scrollIntoView()
        cy.get('[placeholder="Write an interpretation"]').should('be.visible')

        // When connectivity is turned off
        goOfflineAndConfirm()

        // Then it is not possible to interact with interpretations
        cy.contains('Not available offline').should('be.visible')
        // cy.get('[placeholder="Write an interpretation"]').scrollIntoView()
        // cy.get('[placeholder="Write an interpretation"]').should('not.be.visible')
    })

    it.skip('sharing dialog is open when connectivity is lost', () => {
        openAndCacheDashboard(CACHED_DASHBOARD_TITLE)

        // When I open sharing settings
        clickViewActionButton('Share')
        cy.get('h2').contains(CACHED_DASHBOARD_TITLE).should('be.visible')
        // getSharingDialogUserSearch().should('be.visible')

        // And connectivity is turned off
        goOfflineAndConfirm()

        // Then it is not possible to change sharing settings
        cy.contains('Not available offline').should('be.visible')
    })

    it('I show the description while offline', () => {
        openDashboard(UNCACHED_DASHBOARD_TITLE)
        cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')

        // And connectivity is turned off
        goOfflineAndConfirm()

        // When I choose Show Description
        clickViewActionButton('More')
        cy.contains('Show description').click()

        // Then the description is shown along with a warning
        cy.get(dashboardDescriptionSel).should('be.visible')

        // Finally delete the dashboards
        deleteDashboard(UNCACHED_DASHBOARD_TITLE)
        deleteDashboard(CACHED_DASHBOARD_TITLE)
    })
})
