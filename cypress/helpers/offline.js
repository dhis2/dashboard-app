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

beforeEach(() => {
    goOnline()
})

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
    cy.getBySel(newButtonSel, EXTENDED_TIMEOUT).click()
    cy.getBySel(titleInputSel, EXTENDED_TIMEOUT).should('be.visible')

    const title = cachedDashboard
        ? CACHED_DASHBOARD_TITLE
        : UNCACHED_DASHBOARD_TITLE

    cy.getBySel(titleInputSel, EXTENDED_TIMEOUT).type(title)
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
    cy.getBySel(dashboardTitleSel, EXTENDED_TIMEOUT).should('be.visible')
}

export const openDashboard = (title) => {
    cy.getBySel(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()
    checkDashboardIsVisible(title)
}

const checkDashboardIsVisible = (title) => {
    cy.getBySel(dashboardTitleSel).contains(title).should('be.visible')
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
    cy.getBySel(titleInputSel, EXTENDED_TIMEOUT).should('be.visible')
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
    cy.getBySel(dashboardTitleSel).should('be.visible')
}

// Given('I create two dashboards', () => {
export const createTwoDashboards = () => {
    createDashboard(UNCACHED)
    createDashboard(CACHED)
}

// When('I cache one of the dashboards', () => {
export const cacheOneDashboard = () => {
    openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
}

// Then('the cached dashboard has a Last Updated time and chip icon', () => {
export const checkCachedDashboard = () => {
    // openDashboard(CACHED_DASHBOARD_TITLE)
    // cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('be.visible')

    // check that the chip has the icon
    cy.getBySel(dashboardChipSel)
        .contains(CACHED_DASHBOARD_TITLE)
        .siblings('svg')
        .its('length')
        .should('eq', 1)
}

// Then(
//     'the uncached dashboard does not have a Last Updated time and no chip icon',
//     () => {
export const checkUncachedDashboard = () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)
    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')

    // cy.getBySel(dashboardChipSel)
    //     .contains(CACHED_DASHBOARD_TITLE)
    //     .siblings('svg')
    //     .first()
    //     .should('not.exist')
}

// Given('I open an uncached dashboard', () => {
export const openUncachedDashboard = () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)
    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')

    checkCorrectMoreOptions(UNCACHED)
    closeMenu()
}

// When('connectivity is turned off', () => {
export const turnOffConnectivity = () => {
    goOffline()
    cy.get('[data-test="headerbar-online-status"]')
        .contains('Offline')
        .should('be.visible')
    cy.get('[data-test="headerbar-online-status"]')
        .contains('Online')
        .should('not.exist')
}

// When('connectivity is turned on', () => {
export const turnOnConnectivity = () => {
    goOnline()
    cy.get('[data-test="headerbar-online-status"]')
        .contains('Online')
        .should('be.visible')
    cy.get('[data-test="headerbar-online-status"]')
        .contains('Offline')
        .should('not.exist')
}

// Then(
//     'all actions for {string} dashboard requiring connectivity are disabled',
export const checkConnectivityDisabled = (cacheState) => {
    // new button
    cy.getBySel(newButtonSel).should('be.disabled')
    // edit, sharing, starring, filtering, all options under more
    getViewActionButton('Edit').should('be.disabled')
    getViewActionButton('Share').should('be.disabled')
    getViewActionButton('Add filter').should('be.disabled')
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
    cy.contains('li', 'View fullscreen').should('not.have.class', 'disabled')
}

// Then('all edit actions requiring connectivity are disabled', () => {
export const checkEditActionsDisabled = () => {
    cy.contains('Save changes').should('be.disabled')
    cy.contains('Print preview').should('be.disabled')
    cy.contains('Filter settings').should('be.disabled')
    cy.contains('Translate').should('be.disabled')
    cy.contains('Delete').should('be.disabled')
    cy.contains('Exit without saving').should('not.be.disabled')

    cy.contains('Change layout').should('be.disabled')
    cy.get(itemSearchSel).find('input').should('have.class', 'disabled')
}

// Then('all edit actions requiring connectivity are enabled', () => {
export const checkEditActionsEnabled = () => {
    cy.contains('Save changes').should('be.enabled')
    cy.contains('Print preview').should('be.enabled')
    cy.contains('Filter settings').should('be.enabled')
    cy.contains('Translate').should('be.enabled')
    cy.contains('Delete').should('be.enabled')
    cy.contains('Exit without saving').should('be.enabled')

    cy.contains('Change layout').should('be.enabled')
    cy.get(itemSearchSel).find('input').should('not.have.class', 'disabled')
}

// Given('I open and cache a dashboard', () => {
export const openAndCacheDashboard2 = () => {
    openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
}

// Then('the cached dashboard options are available', () => {
export const checkCachedDashboardOptions = () => {
    checkCorrectMoreOptions(CACHED)
    closeMenu()
}

// When('I click to open an uncached dashboard', () => {
export const clickToOpenUncachedDashboard = () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)

    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')
}

// When('I click to open an uncached dashboard when offline', () => {
export const clickToOpenUncachedDashboardWhenOffline = () => {
    cy.getBySel(dashboardChipSel, EXTENDED_TIMEOUT)
        .contains(UNCACHED_DASHBOARD_TITLE)
        .click()
}

// When('I click to open a cached dashboard when offline', () => {
export const clickToOpenCachedDashboardWhenOffline = () => {
    openDashboard(CACHED_DASHBOARD_TITLE)
}

// Then('the cached dashboard is loaded and displayed in view mode', () => {
export const checkCachedDashboard2 = () => {
    checkDashboardIsVisible(CACHED_DASHBOARD_TITLE)

    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('be.visible')
    cy.contains(CACHED_DASHBOARD_ITEM_NAME).should('be.visible')
}

// Then('the uncached dashboard is loaded and displayed in view mode', () => {
export const checkUncachedDashboard2 = () => {
    checkDashboardIsVisible(UNCACHED_DASHBOARD_TITLE)

    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')
    cy.contains(UNCACHED_DASHBOARD_ITEM_NAME).should('be.visible')
}

// Given('I open an uncached dashboard in edit mode', () => {
export const openUncachedDashboardInEditMode = () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)
    enterEditMode()
}

// Then('the dashboard is not available and offline message is displayed', () => {
export const dashboardNotAvail = () => {
    cy.getBySel(dashboardTitleSel).should('not.exist')

    cy.contains('This dashboard cannot be loaded while offline').should(
        'be.visible'
    )
}

// Given('I open a cached dashboard in edit mode', () => {
export const openCachedDashboardInEditMode = () => {
    openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
    enterEditMode()
}

// When('I open sharing settings', () => {
export const openSharingSettings = () => {
    clickViewActionButton('Share')
    cy.get('h2').contains(CACHED_DASHBOARD_TITLE).should('be.visible')
    getSharingDialogUserSearch().should('be.visible')
}

// Then('it is not possible to change sharing settings', () => {
export const expectSharingDisabled = () => {
    // TODO - implement once the new sharing dialog is merged
}

// When('I open the interpretations panel', () => {
export const openInterpretationsPanel = () => {
    cy.get(itemMenuButtonSel, EXTENDED_TIMEOUT).click()
    cy.contains('Show details and interpretations').click()
    cy.get('[placeholder="Write an interpretation"]')
        .scrollIntoView()
        .should('be.visible')
}

// Then('it is not possible to interact with interpretations', () => {
export const expectInterpretationsDisabled = () => {
    cy.contains('Not available offline').should('be.visible')

    // cy.get('[placeholder="Write an interpretation"]')
    //     .scrollIntoView()
    //     .should('not.be.visible')
}

// Given('I delete the cached and uncached dashboard', () => {
export const deleteCachedAndUncachedDashboard = () => {
    deleteDashboard(UNCACHED_DASHBOARD_TITLE)
    deleteDashboard(CACHED_DASHBOARD_TITLE)
}

// When('I choose Show Description', () => {
export const showDashboardDescription = () => {
    clickViewActionButton('More')
    cy.contains('Show description').click()
}

// Then('the description is shown along with a warning', () => {
export const checkDashboardDescriptionWarning = () => {
    cy.get(dashboardDescriptionSel).should('be.visible')
}

// When('I click to Remove from offline storage', () => {
export const removeFromOfflineStorage = () => {
    clickViewActionButton('More')
    cy.contains('Remove from offline storage').click()
}

// Then('the dashboard is not cached', () => {
export const checkDashboardNotCached = () => {
    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')
}
