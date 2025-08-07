import { dashboards } from '../assets/backends/sierraLeone_236.js'
import {
    dashboardTitleSel,
    dashboardsNavMenuButtonSel,
    newButtonSel,
    gridItemSel,
    outerScrollContainerSel,
    confirmViewMode,
    titleInputSel,
    actionsBarSel,
    clickViewActionButton,
    clickEditActionButton,
    addFilter,
    filterBadgeSel,
    dimensionsModalSel,
    confirmEditMode,
    addDashboardItem,
} from '../elements/index.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

const switchToSmallScreen = (portrait = true) => {
    if (portrait) {
        cy.viewport(460, 600)
    } else {
        cy.viewport(600, 480)
    }
    // to account for debounced window resize
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
}

const switchToWideScreen = () => {
    cy.viewport(950, 800)
    // to account for debounced window resize
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
}

describe('Responsive Dashboard', () => {
    it('views a dashboard on small and wide screens', () => {
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode('Delivery')

        switchToSmallScreen()

        // Assert small screen view is shown
        cy.get(dashboardsNavMenuButtonSel).should('be.visible')
        cy.get(newButtonSel).should('not.be.visible')

        // Titlebar - only the More button and the title (Edit, Share, Filter buttons hidden)
        cy.get('button').contains('Edit').should('not.be.visible')
        cy.get('button').contains('Share').should('not.be.visible')
        cy.get('button').contains('Filter').should('not.be.visible')

        switchToWideScreen()

        // Assert wide screen view is shown
        cy.get(dashboardsNavMenuButtonSel).should('be.visible')
        cy.get(newButtonSel).should('be.visible')

        cy.get('button').contains('Edit').should('be.visible')
        cy.get('button').contains('Share').should('be.visible')
        cy.get('button').contains('Filter').should('be.visible')
    })

    it('edits an existing dashboard on small and wide screens', () => {
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode('Delivery')

        // Choose to edit dashboard
        clickViewActionButton('Edit')

        // Verify edit mode
        confirmEditMode()

        const TITLE = 'changed dashboard title'
        // Add to the dashboard title
        cy.get(titleInputSel).type(TITLE)

        // Add dashboard items
        addDashboardItem('ANC: 1 and 3 coverage Yearly') // Chart

        switchToSmallScreen()

        // Assert small screen edit view is shown
        cy.contains('Save changes').should('not.be.visible')
        cy.contains('Exit without saving').should('not.be.visible')
        cy.contains('dashboards on small screens is not supported').should(
            'be.visible'
        )
        cy.get(titleInputSel).should('not.be.visible')
        cy.get('.react-grid-layout').should('not.be.visible')

        // Restore the wide screen
        switchToWideScreen()

        // Assert wide screen edit view is shown
        cy.get('button').contains('Save changes').should('be.visible')
        cy.get('button').contains('Exit without saving').should('be.visible')
        cy.get(titleInputSel).scrollIntoView()
        cy.get(titleInputSel).should('be.visible')
        cy.get('.react-grid-layout').should('be.visible')

        // Assert changes are still there
        cy.get(titleInputSel).scrollIntoView()
        cy.get(`${titleInputSel} input`).should(
            'have.value',
            `Delivery${TITLE}`
        )

        // Cleanup - discard changes
        clickEditActionButton('Exit without saving')
        confirmViewMode('Delivery')
    })

    it('creates a new dashboard on small and wide screens', () => {
        // Start a new dashboard
        cy.get(newButtonSel, EXTENDED_TIMEOUT).click()

        const TITLE = 'My new dashboard'
        // Change dashboard title
        cy.get(titleInputSel).type(TITLE)

        // Add dashboard items
        addDashboardItem('ANC: 1 and 3 coverage Yearly') // Chart

        // Switch to small screen
        switchToSmallScreen()

        // Assert small screen edit view is shown
        cy.contains('Save changes').should('not.be.visible')
        cy.contains('Exit without saving').should('not.be.visible')
        cy.contains('dashboards on small screens is not supported').should(
            'be.visible'
        )
        cy.get(titleInputSel).should('not.be.visible')
        cy.get('.react-grid-layout').should('not.be.visible')

        // Restore the wide screen
        switchToWideScreen()

        // Assert wide screen edit view is shown
        cy.get('button').contains('Save changes').should('be.visible')
        cy.get('button').contains('Exit without saving').should('be.visible')
        cy.get(titleInputSel).scrollIntoView()
        cy.get(titleInputSel).should('be.visible')
        cy.get('.react-grid-layout').should('be.visible')

        // Assert changes are still there
        cy.get(titleInputSel).scrollIntoView()
        cy.get(`${titleInputSel} input`).should('have.value', TITLE)

        // Cleanup - discard changes
        clickEditActionButton('Exit without saving')
        confirmViewMode()
    })

    it('redirects from new to view mode while in small screen', () => {
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode('Delivery')

        // Switch to small screen
        switchToSmallScreen()

        // Change url to new
        const url = `${Cypress.config().baseUrl}/#/new`
        cy.window().then((win) => {
            win.location.assign(url)
            // Wait for the dashboard request to complete
            cy.wait(2000) // eslint-disable-line cypress/no-unnecessary-waiting
        })

        // Assert the "Delivery" dashboard displays in default view mode
        cy.location().should((loc) => {
            expect(loc.hash).to.equal('#/')
        })

        cy.get(dashboardTitleSel)
            .should('be.visible')
            .and('contain', 'Delivery')

        cy.get(`${gridItemSel}.VISUALIZATION`)
            .first()
            .getIframeBody()
            .as('iframe')
            .should('be.visible')
    })

    it('redirects from edit to view mode while in small screen', () => {
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode('Delivery')

        // Switch to small screen
        switchToSmallScreen()

        // Change url to edit
        cy.location().then((loc) => {
            const url = `${loc.href}/edit`
            cy.window().then((win) => {
                win.location.assign(url)
                cy.wait(2000) // eslint-disable-line cypress/no-unnecessary-waiting
            })
        })

        // Assert the "Delivery" dashboard displays in view mode
        cy.url().should('not.include', 'edit')
        cy.get(dashboardTitleSel)
            .should('be.visible')
            .and('contain', 'Delivery')
    })

    it('cannot edit dashboard filter while in small screen', () => {
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode('Delivery')

        // Add a "Period" filter
        addFilter('Period')

        // Switch to small screen
        switchToSmallScreen()

        // Click on the "Period" filter badge
        cy.get(filterBadgeSel)
            .find('button')
            .contains('Period')
            .click({ force: true })

        // Assert the filter modal is not opened
        cy.get(dimensionsModalSel, EXTENDED_TIMEOUT).should('not.exist')
    })

    it('edit bar scrolls away in phone landscape', () => {
        cy.visit(dashboards.Delivery.route)
        switchToWideScreen()
        confirmViewMode('Delivery')

        // Choose to edit dashboard
        clickViewActionButton('Edit')
        confirmEditMode()

        // Go to phone landscape
        switchToSmallScreen(false)

        // Scroll down
        cy.get(outerScrollContainerSel, EXTENDED_TIMEOUT).scrollTo('bottom')

        // This item is on the bottom of the Delivery dashboard
        cy.contains(
            'Births attended by skilled health personnel by orgunit last year',
            EXTENDED_TIMEOUT
        ).should('be.visible')

        // Assert the edit control bar is not visible
        cy.get(actionsBarSel, EXTENDED_TIMEOUT).should('not.be.visible')

        // Scroll to top
        cy.get(outerScrollContainerSel).scrollTo('top')

        // Assert the edit control bar is visible
        cy.get(actionsBarSel).should('be.visible')

        // Cleanup - discard changes
        clickEditActionButton('Exit without saving')
        confirmViewMode('Delivery')
    })

    it('dashboards bar scrolls away in phone landscape', () => {
        cy.visit(`/${dashboards.Delivery.route}`)
        confirmViewMode('Delivery')

        // Assert the dashboards navigation button is visible
        cy.get(dashboardsNavMenuButtonSel).should('be.visible')

        // Go to phone landscape
        switchToSmallScreen(false)

        // Assert the dashboards navigation button is visible
        cy.get(dashboardsNavMenuButtonSel, EXTENDED_TIMEOUT).should(
            'be.visible'
        )

        // Scroll down
        cy.get(outerScrollContainerSel, EXTENDED_TIMEOUT).scrollTo('bottom')

        // This item is on the bottom of the Delivery dashboard
        cy.contains(
            'Births attended by skilled health personnel by orgunit last year',
            EXTENDED_TIMEOUT
        ).should('be.visible')

        // Assert the dashboards navigation button is not visible
        cy.get(dashboardsNavMenuButtonSel, EXTENDED_TIMEOUT).should(
            'not.be.visible'
        )

        // Scroll to top
        cy.get(outerScrollContainerSel).scrollTo('top')

        // Assert the dashboards navigation button is visible
        cy.get(dashboardsNavMenuButtonSel).should('be.visible')
    })
})
