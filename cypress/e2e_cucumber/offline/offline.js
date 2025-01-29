import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { itemMenuButtonSel } from '../../elements/dashboardItem.js'
import {
    titleInputSel,
    confirmActionDialogSel,
    clickEditActionButton,
    itemSearchSel,
} from '../../elements/editDashboard.js'
import { getSharingDialogUserSearch } from '../../elements/sharingDialog.js'
import {
    newButtonSel,
    getViewActionButton,
    clickViewActionButton,
    dashboardTitleSel,
    dashboardChipSel,
    dashboardDescriptionSel,
} from '../../elements/viewDashboard.js'
import {
    EXTENDED_TIMEOUT,
    goOnline,
    goOffline,
    createDashboardTitle,
} from '../../support/utils.js'

// TODO - once the offline tests are enabled, goOnline needs to be called in the specific
// tests when needed rather than a beforeEach since this runs before every test
// regardless of test file
// beforeEach(() => {
//     goOnline()
// })

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

    closeMenu()
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

const checkCorrectMoreOptions = (cacheState) => {
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

const checkCorrectMoreOptionsEnabledState = (online, cacheState) => {
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
    closeMenu()
}

const closeMenu = () => {
    cy.get('[data-test="dhis2-uicore-layer"]').click('topLeft')
}

const deleteDashboard = (dashboardTitle) => {
    openDashboard(dashboardTitle)
    enterEditMode()
    clickEditActionButton('Delete')
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
    cy.get(dashboardTitleSel).should('be.visible')
}

// Scenario: I cache an uncached dashboard

Given('I create two dashboards', () => {
    cy.log('create the uncached dashboard')
    createDashboard(UNCACHED)
    createDashboard(CACHED)
})

When('I cache one of the dashboards', () => {
    openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
})

Then('the cached dashboard has a Last Updated time and chip icon', () => {
    // openDashboard(CACHED_DASHBOARD_TITLE)
    // cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('be.visible')

    // check that the chip has the icon
    cy.get(dashboardChipSel)
        .contains(CACHED_DASHBOARD_TITLE)
        .siblings('svg')
        .its('length')
        .should('eq', 1)
})

Then(
    'the uncached dashboard does not have a Last Updated time and no chip icon',
    () => {
        openDashboard(UNCACHED_DASHBOARD_TITLE)
        cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')

        // cy.get(dashboardChipSel)
        //     .contains(CACHED_DASHBOARD_TITLE)
        //     .siblings('svg')
        //     .first()
        //     .should('not.exist')
    }
)

// Scenario: I am online with an uncached dashboard when I lose connectivity

Given('I open an uncached dashboard', () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)
    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')

    checkCorrectMoreOptions(UNCACHED)
    closeMenu()
})

When('connectivity is turned off', () => {
    goOffline()
    cy.get('[data-test="headerbar-online-status"]')
        .contains('Offline')
        .should('be.visible')
    cy.get('[data-test="headerbar-online-status"]')
        .contains('Online')
        .should('not.exist')
})

When('connectivity is turned on', () => {
    goOnline()
    cy.get('[data-test="headerbar-online-status"]')
        .contains('Online')
        .should('be.visible')
    cy.get('[data-test="headerbar-online-status"]')
        .contains('Offline')
        .should('not.exist')
})

Then(
    'all actions for {string} dashboard requiring connectivity are disabled',
    (cacheState) => {
        // new button
        cy.get(newButtonSel).should('be.disabled')
        // edit, sharing, starring, filtering, all options under more
        getViewActionButton('Edit').should('be.disabled')
        getViewActionButton('Share').should('be.disabled')
        getViewActionButton('Filter').should('be.disabled')
        getViewActionButton('More').should('be.enabled')

        checkCorrectMoreOptionsEnabledState(false, cacheState)

        // item context menu (everything except view fullscreen)
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
    }
)

Then('all edit actions requiring connectivity are disabled', () => {
    cy.contains('Save changes').should('be.disabled')
    cy.contains('Print preview').should('be.disabled')
    cy.contains('Filter settings').should('be.disabled')
    cy.contains('Translate').should('be.disabled')
    cy.contains('Delete').should('be.disabled')
    cy.contains('Exit without saving').should('not.be.disabled')

    cy.contains('Change layout').should('be.disabled')
    cy.get(itemSearchSel).find('input').should('have.class', 'disabled')
})

Then('all edit actions requiring connectivity are enabled', () => {
    cy.contains('Save changes').should('be.enabled')
    cy.contains('Print preview').should('be.enabled')
    cy.contains('Filter settings').should('be.enabled')
    cy.contains('Translate').should('be.enabled')
    cy.contains('Delete').should('be.enabled')
    cy.contains('Exit without saving').should('be.enabled')

    cy.contains('Change layout').should('be.enabled')
    cy.get(itemSearchSel).find('input').should('not.have.class', 'disabled')
})

// Scenario: I am online with a cached dashboard when I lose connectivity
Given('I open and cache a dashboard', () => {
    openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
})

Then('the cached dashboard options are available', () => {
    checkCorrectMoreOptions(CACHED)
    closeMenu()
})

// Scenario: I am offline and switch to an uncached dashboard
When('I click to open an uncached dashboard', () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)

    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')
})

When('I click to open an uncached dashboard when offline', () => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT)
        .contains(UNCACHED_DASHBOARD_TITLE)
        .click()
})

When('I click to open a cached dashboard when offline', () => {
    openDashboard(CACHED_DASHBOARD_TITLE)
})

// Scenario: I am offline and switch to a cached dashboard
Then('the cached dashboard is loaded and displayed in view mode', () => {
    checkDashboardIsVisible(CACHED_DASHBOARD_TITLE)

    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('be.visible')
    cy.contains(CACHED_DASHBOARD_ITEM_NAME).should('be.visible')
})

Then('the uncached dashboard is loaded and displayed in view mode', () => {
    checkDashboardIsVisible(UNCACHED_DASHBOARD_TITLE)

    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')
    cy.contains(UNCACHED_DASHBOARD_ITEM_NAME).should('be.visible')
})

// Scenario: I am offline and switch to an uncached dashboard and then connectivity is restored

// Scenario: I am in edit mode on an uncached dashboard when I lose connectivity and then I exit without saving and then connectivity is restored
Given('I open an uncached dashboard in edit mode', () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)
    enterEditMode()
})

Then('the dashboard is not available and offline message is displayed', () => {
    cy.get(dashboardTitleSel).should('not.exist')

    cy.contains('This dashboard cannot be loaded while offline').should(
        'be.visible'
    )
})

// Scenario: I am in edit mode on a cached dashboard when I lose connectivity and then I exit without saving
Given('I open a cached dashboard in edit mode', () => {
    openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
    enterEditMode()
})

When('I open sharing settings', () => {
    clickViewActionButton('Share')
    cy.get('h2').contains(CACHED_DASHBOARD_TITLE).should('be.visible')
    getSharingDialogUserSearch().should('be.visible')
})

Then('it is not possible to change sharing settings', () => {
    // TODO - implement once the new sharing dialog is merged
})

// Scenario: The interpretations panel is open when connectivity is lost
When('I open the interpretations panel', () => {
    cy.get(itemMenuButtonSel, EXTENDED_TIMEOUT).click()
    cy.contains('Show details and interpretations').click()
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[placeholder="Write an interpretation"]')
        .scrollIntoView()
        .should('be.visible')
})

Then('it is not possible to interact with interpretations', () => {
    cy.contains('Not available offline').should('be.visible')

    // cy.get('[placeholder="Write an interpretation"]')
    //     .scrollIntoView()
    //     .should('not.be.visible')
})

Given('I delete the cached and uncached dashboard', () => {
    deleteDashboard(UNCACHED_DASHBOARD_TITLE)
    deleteDashboard(CACHED_DASHBOARD_TITLE)
})

// Scenario: I show the description while offline
When('I choose Show Description', () => {
    clickViewActionButton('More')
    cy.contains('Show description').click()
})

Then('the description is shown along with a warning', () => {
    cy.get(dashboardDescriptionSel).should('be.visible')
})

// Scenario: I remove a dashboard from cache while offline
When('I click to Remove from offline storage', () => {
    clickViewActionButton('More')
    cy.contains('Remove from offline storage').click()
})

Then('the dashboard is not cached', () => {
    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')
})
