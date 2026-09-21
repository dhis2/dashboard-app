import { dashboards } from '../assets/backends/sierraLeone_236.js'
import {
    closeNavigationMenu,
    confirmViewMode,
    getNavigationMenuItem,
    getNavigationMenuTab,
    getRemoveRecentButton,
} from '../elements/index.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

// Matches the dashboard name hardcoded in edit_errors.cy.js: known to exist
// in the standard DHIS2 demo database.
const DASHBOARD_NAME = 'Delivery'

// Note: the startup auto-select on route `/` deliberately does not record
// into Recent, but that is not asserted here - the demo database's starting
// state (and any residue from earlier test runs sharing the same user's
// localStorage) makes "Recent is still empty after `cy.visit('/')`" too
// flaky to rely on.
describe('Tabbed dashboards navigation', () => {
    it('shows the All, Starred, Mine and Recent tabs when the menu is opened', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        getNavigationMenuTab('All').should('be.visible')
        getNavigationMenuTab('Starred', true).should('be.visible')
        getNavigationMenuTab('Mine', true).should('be.visible')
        getNavigationMenuTab('Recent', true).should('be.visible')

        closeNavigationMenu()
    })

    it('adds a dashboard to Recent when it is opened from the menu', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        getNavigationMenuItem(DASHBOARD_NAME).click()
        confirmViewMode(DASHBOARD_NAME)

        getNavigationMenuTab('Recent').click()
        getNavigationMenuItem(DASHBOARD_NAME, true).should('be.visible')

        closeNavigationMenu()
    })

    it('removes a dashboard from Recent via its remove button', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        // Depends on the previous test having added Delivery to Recent.
        getNavigationMenuTab('Recent').click()
        getNavigationMenuItem(DASHBOARD_NAME, true).should('be.visible')

        getRemoveRecentButton(DASHBOARD_NAME, true).click()

        // Assert the absence now, before Delivery is reopened by a later
        // test. Removal is not a permanent blocklist - reopening the
        // dashboard puts it straight back into Recent.
        getNavigationMenuItem(DASHBOARD_NAME, true).should('not.exist')

        closeNavigationMenu()
    })

    it('keeps the active tab selected after a page reload', () => {
        cy.visit('/', EXTENDED_TIMEOUT)

        getNavigationMenuTab('Starred').click()
        getNavigationMenuTab('Starred', true).should(
            'have.attr',
            'aria-selected',
            'true'
        )

        cy.reload(EXTENDED_TIMEOUT)

        // Check the sticky preference directly via aria-selected, rather
        // than inferring it from the visible list - the localStorage
        // preference survives the reload even though the in-memory redux
        // state does not.
        getNavigationMenuTab('Starred').should(
            'have.attr',
            'aria-selected',
            'true'
        )

        closeNavigationMenu()
    })

    it('records a dashboard opened directly by URL into Recent', () => {
        // Delivery was removed from Recent above, and the reload test never
        // reopens it, so it is not currently in Recent.
        //
        // Visiting its route directly - rather than clicking it in the menu
        // - is the point of this test: it exercises the dashboard-load path
        // instead of the menu-click path, which is the only thing that
        // would catch the recording hook being wired to the wrong one.
        cy.visit(dashboards.Delivery.route, EXTENDED_TIMEOUT)
        confirmViewMode(DASHBOARD_NAME)

        getNavigationMenuTab('Recent').click()
        getNavigationMenuItem(DASHBOARD_NAME, true).should('be.visible')

        closeNavigationMenu()
    })
})
