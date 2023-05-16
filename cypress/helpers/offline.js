import { itemMenuButtonSel } from '../elements/dashboardItem.js'
import {
    titleInputSel,
    confirmActionDialogSel,
    clickEditActionButton,
    itemSearchSel,
} from '../elements/editDashboard.js'
import { getSharingDialogUserSearch } from '../elements/sharingDialog.js'
import {
    newButtonSel,
    getViewActionButton,
    clickViewActionButton,
    dashboardTitleSel,
    dashboardChipSel,
    dashboardDescriptionSel,
} from '../elements/viewDashboard.js'
import {
    EXTENDED_TIMEOUT,
    goOnline,
    goOffline,
    createDashboardTitle,
} from '../support/utils.js'

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

// TODO - use the function in edit_dashboard instead
const createDashboard = (cacheState) => {
    const cachedDashboard = cacheState === CACHED
    cy.getBySel(newButtonSel, EXTENDED_TIMEOUT).click()
    cy.getBySel(titleInputSel, EXTENDED_TIMEOUT).should('be.visible')

    const title = cachedDashboard
        ? CACHED_DASHBOARD_TITLE
        : UNCACHED_DASHBOARD_TITLE

    cy.getBySel(titleInputSel, EXTENDED_TIMEOUT).type(title)
    cy.getBySel('item-search').click()
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

// TODO - use the function in edit_dashboard instead
export const openDashboard = (title) => {
    cy.getBySel(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()
    checkDashboardIsVisible(title)
}

// TODO - use the function in edit_dashboard instead
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
    cy.getBySel('dhis2-uicore-layer').click('topLeft')
}

const deleteDashboard = (dashboardTitle) => {
    openDashboard(dashboardTitle)
    enterEditMode()
    clickEditActionButton('Delete')
    cy.getBySel(confirmActionDialogSel)
        .find('button')
        .contains('Delete')
        .click()
    cy.getBySel(dashboardTitleSel).should('be.visible')
}

export const createTwoDashboards = () => {
    createDashboard(UNCACHED)
    createDashboard(CACHED)
}

export const cacheOneDashboard = () => {
    openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
}

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

export const checkUncachedDashboard = () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)
    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')

    // FIXME
    // cy.getBySel(dashboardChipSel)
    //     .contains(CACHED_DASHBOARD_TITLE)
    //     .siblings('svg')
    //     .first()
    //     .should('not.exist')
}

export const openUncachedDashboard = () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)
    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')

    checkCorrectMoreOptions(UNCACHED)
    closeMenu()
}

export const turnOffConnectivity = () => {
    goOffline()
    cy.getBySel('headerbar-online-status')
        .contains('Offline')
        .should('be.visible')
    cy.getBySel('headerbar-online-status')
        .contains('Online')
        .should('not.exist')
}

export const turnOnConnectivity = () => {
    goOnline()
    cy.getBySel('headerbar-online-status')
        .contains('Online')
        .should('be.visible')
    cy.getBySel('headerbar-online-status')
        .contains('Offline')
        .should('not.exist')
}

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
    cy.getBySel(itemMenuButtonSel, EXTENDED_TIMEOUT).click()

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

export const checkEditActionsDisabled = () => {
    cy.contains('Save changes').should('be.disabled')
    cy.contains('Print preview').should('be.disabled')
    cy.contains('Filter settings').should('be.disabled')
    cy.contains('Translate').should('be.disabled')
    cy.contains('Delete').should('be.disabled')
    cy.contains('Exit without saving').should('not.be.disabled')

    cy.contains('Change layout').should('be.disabled')
    cy.getBySel(itemSearchSel).find('input').should('have.class', 'disabled')
}

export const checkEditActionsEnabled = () => {
    cy.contains('Save changes').should('be.enabled')
    cy.contains('Print preview').should('be.enabled')
    cy.contains('Filter settings').should('be.enabled')
    cy.contains('Translate').should('be.enabled')
    cy.contains('Delete').should('be.enabled')
    cy.contains('Exit without saving').should('be.enabled')

    cy.contains('Change layout').should('be.enabled')
    cy.getBySel(itemSearchSel)
        .find('input')
        .should('not.have.class', 'disabled')
}

export const openAndCacheDashboard2 = () => {
    openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
}

export const checkCachedDashboardOptions = () => {
    checkCorrectMoreOptions(CACHED)
    closeMenu()
}

export const clickToOpenUncachedDashboard = () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)

    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')
}

export const clickToOpenUncachedDashboardWhenOffline = () => {
    cy.getBySel(dashboardChipSel, EXTENDED_TIMEOUT)
        .contains(UNCACHED_DASHBOARD_TITLE)
        .click()
}

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

export const openUncachedDashboardInEditMode = () => {
    openDashboard(UNCACHED_DASHBOARD_TITLE)
    enterEditMode()
}

export const dashboardNotAvail = () => {
    cy.getBySel(dashboardTitleSel).should('not.exist')

    cy.contains('This dashboard cannot be loaded while offline').should(
        'be.visible'
    )
}

export const openCachedDashboardInEditMode = () => {
    openAndCacheDashboard(CACHED_DASHBOARD_TITLE)
    enterEditMode()
}

export const openSharingSettings = () => {
    clickViewActionButton('Share')
    cy.get('h2').contains(CACHED_DASHBOARD_TITLE).should('be.visible')
    getSharingDialogUserSearch().should('be.visible')
}

// Then('it is not possible to change sharing settings', () => {
export const expectSharingDisabled = () => {
    // TODO - implement once the new sharing dialog is merged
}

export const openInterpretationsPanel = () => {
    cy.getBySel(itemMenuButtonSel, EXTENDED_TIMEOUT).click()
    cy.contains('Show details and interpretations').click()
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[placeholder="Write an interpretation"]')
        .scrollIntoView()
        .should('be.visible')
}

export const expectInterpretationsDisabled = () => {
    cy.contains('Not available offline').should('be.visible')

    // FIXME
    // cy.get('[placeholder="Write an interpretation"]')
    //     .scrollIntoView()
    //     .should('not.be.visible')
}

export const deleteCachedAndUncachedDashboard = () => {
    deleteDashboard(UNCACHED_DASHBOARD_TITLE)
    deleteDashboard(CACHED_DASHBOARD_TITLE)
}

// Then('the description is shown along with a warning', () => {
export const checkDashboardDescriptionWarning = () => {
    cy.getBySel(dashboardDescriptionSel).should('be.visible')
}

export const removeFromOfflineStorage = () => {
    clickViewActionButton('More')
    cy.contains('Remove from offline storage').click()
}

export const checkDashboardNotCached = () => {
    cy.contains(OFFLINE_DATA_LAST_UPDATED_TEXT).should('not.exist')
}
