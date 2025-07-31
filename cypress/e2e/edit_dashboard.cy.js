import {
    newButtonSel,
    dashboardTitleSel,
    addDashboardItem,
    clickEditActionButton,
    clickViewActionButton,
    confirmEditMode,
    confirmViewMode,
    dashboardStarredSel,
    dashboardUnstarredSel,
    confirmActionDialogSel,
    getNavigationMenuItem,
    closeNavigationMenu,
    navMenuItemStarIconSel,
    getSharingDialogUserSearch,
} from '../elements/index.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const deleteDashboard = (dashboardTitle) => {
    clickEditActionButton('Delete')

    cy.contains(
        `Deleting dashboard "${dashboardTitle}" will remove it for all users`
    ).should('be.visible')
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
    cy.url().should('not.include', 'edit')

    // Confirm different dashboard is shown in view mode
    getNavigationMenuItem(dashboardTitle).should('not.exist')
    cy.get(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', dashboardTitle)
}

describe('Edit Dashboard', () => {
    it('creates a dashboard', () => {
        cy.visit('/')
        const TEST_DASHBOARD_TITLE = createDashboardTitle('e2e')

        // Start a new dashboard
        cy.get(newButtonSel, EXTENDED_TIMEOUT).click()

        // Add dashboard title
        cy.getByDataTest('dashboard-title-input').type(TEST_DASHBOARD_TITLE)

        // Add dashboard items
        addDashboardItem('Inpatient: BMI this year by districts') // Chart
        addDashboardItem('ANC: IPT 2 Coverage this year') // Map

        // Save dashboard
        clickEditActionButton('Save changes')

        // Dashboard displays in view mode
        confirmViewMode(TEST_DASHBOARD_TITLE)

        // // Open edit mode
        clickViewActionButton('Edit')
        confirmEditMode()

        // // Add another dashboard item
        addDashboardItem('ANC: 3rd visit coverage last year by district') // Map

        // And I click Exit without saving
        clickEditActionButton('Exit without saving')

        // Then the dashboard displays in view mode
        confirmViewMode(TEST_DASHBOARD_TITLE)

        // Delete dashboard
        clickViewActionButton('Edit')
        clickEditActionButton('Delete')

        cy.contains(
            `Deleting dashboard "${TEST_DASHBOARD_TITLE}" will remove it for all users`
        ).should('be.visible')

        // First cancel the delete action
        cy.get(confirmActionDialogSel).find('button').contains('Cancel').click()
        confirmEditMode()

        // Finally, delete it for real
        deleteDashboard(TEST_DASHBOARD_TITLE)
    })

    it('returns to view mode without confirmation when exit without saving', () => {
        cy.visit('/')
        // Start a new dashboard
        cy.get(newButtonSel, EXTENDED_TIMEOUT).click()

        // Add dashboard title
        cy.getByDataTest('dashboard-title-input').type(
            'e2e-exit-without-saving'
        )

        // Add dashboard items
        addDashboardItem('Inpatient: BMI this year by districts') // Chart

        // Click Exit without saving
        clickEditActionButton('Exit without saving')

        confirmViewMode()
    })

    it('stars and unstars a dashboard', () => {
        cy.visit('/')
        const TEST_DASHBOARD_TITLE = createDashboardTitle('e2e-star')

        // Start a new dashboard
        cy.get(newButtonSel, EXTENDED_TIMEOUT).click()

        // Add dashboard title
        cy.getByDataTest('dashboard-title-input').type(TEST_DASHBOARD_TITLE)

        // Add dashboard items
        addDashboardItem('Inpatient: BMI this year by districts') // Chart

        // Save dashboard
        clickEditActionButton('Save changes')

        confirmViewMode(TEST_DASHBOARD_TITLE)

        // Assert dashboard is not starred
        cy.get(dashboardStarredSel).should('not.exist')
        cy.get(dashboardUnstarredSel).should('be.visible')

        cy.intercept('POST', '**/dashboards/*/favorite').as('starDashboard')

        // Star the dashboard
        cy.get(dashboardUnstarredSel).click()
        cy.wait('@starDashboard')
            .its('response.statusCode')
            .should('be.oneOf', [200, 201])

        // Assert dashboard is starred
        cy.get(dashboardStarredSel).should('be.visible')
        cy.get(dashboardUnstarredSel).should('not.exist')
        getNavigationMenuItem(TEST_DASHBOARD_TITLE)
            .find(navMenuItemStarIconSel)
            .should('be.visible')

        closeNavigationMenu()

        clickViewActionButton('Edit')
        confirmEditMode()
        // Add another dashboard item
        addDashboardItem('ANC: IPT 2 Coverage this year') // Map

        // Save dashboard
        clickEditActionButton('Save changes')
        confirmViewMode(TEST_DASHBOARD_TITLE)

        cy.get(dashboardStarredSel).should('be.visible')
        cy.get(dashboardUnstarredSel).should('not.exist')

        cy.intercept('DELETE', '**/dashboards/*/favorite').as('unstarDashboard')

        // Unstar the dashboard
        cy.get(dashboardStarredSel).click()

        cy.wait('@unstarDashboard')
            .its('response.statusCode')
            .should('be.oneOf', [200, 204])
        cy.get(dashboardUnstarredSel).should('be.visible')
        getNavigationMenuItem(TEST_DASHBOARD_TITLE)
            .find(navMenuItemStarIconSel)
            .should('not.exist')

        closeNavigationMenu()

        // Delete the dashboard
        clickViewActionButton('Edit')
        deleteDashboard(TEST_DASHBOARD_TITLE)
    })

    // Scenario: I change sharing settings of a dashboard
    it('changes sharing settings', () => {
        const USER_NAME = 'Kevin Boateng'
        //     create a dashboard
        cy.visit('/')
        const TEST_DASHBOARD_TITLE = createDashboardTitle('e2e-sharing')

        // Start a new dashboard
        cy.get(newButtonSel, EXTENDED_TIMEOUT).click()

        // Add dashboard title
        cy.getByDataTest('dashboard-title-input').type(TEST_DASHBOARD_TITLE)

        // Add dashboard items
        addDashboardItem('Inpatient: BMI this year by districts') // Chart

        // Save dashboard
        clickEditActionButton('Save changes')

        confirmViewMode(TEST_DASHBOARD_TITLE)

        // Open edit mode
        clickViewActionButton('Edit')
        confirmEditMode()

        //     Change sharing settings
        cy.get('button').contains('Share', EXTENDED_TIMEOUT).click()

        //confirm that Boateng is not currently listed
        cy.get('hr').should('have.length', 3)

        getSharingDialogUserSearch().type('Boateng')
        cy.contains(USER_NAME).click()

        cy.get('div').contains(USER_NAME).should('be.visible')

        cy.get('button').contains('close', { matchCase: false }).click()

        //     edit dashboard
        clickViewActionButton('Edit')
        confirmEditMode()

        //     And dashboard is saved
        clickEditActionButton('Save changes')
        cy.get(dashboardTitleSel, EXTENDED_TIMEOUT)
            .should('be.visible')
            .and('contain', TEST_DASHBOARD_TITLE)

        //     The new sharing settings should be preserved
        cy.visit('/')
        // open TEST_DASHBOARD_TITLE dashboard
        getNavigationMenuItem(TEST_DASHBOARD_TITLE).click()
        confirmViewMode(TEST_DASHBOARD_TITLE)

        cy.get(dashboardTitleSel, EXTENDED_TIMEOUT).should('be.visible')
        cy.get('button')
            .contains('Share', EXTENDED_TIMEOUT)
            .should('be.visible')
        cy.get('button').contains('Share', EXTENDED_TIMEOUT).click()

        cy.get('hr').should('have.length', 4)
        cy.get('div').contains(USER_NAME, EXTENDED_TIMEOUT).should('be.visible')
    })
})

// Scenario: I move an item on a dashboard
//    Given I open existing dashboard
//    When I choose to edit dashboard
//    And the chart item is displayed
//    Then no analytics requests are made when item is moved

// Then('no analytics requests are made when item is moved', () => {
//     const WRONG_SUBTITLE = 'WRONG_SUBTITLE'
//     cy.intercept(/analytics\.json(\S)*skipMeta=false/, (req) => {
//         req.reply((res) => {
//             // modify the chart subtitle so we can check whether the api request
//             // was made. (It shouldn't be - that's the test)
//             res.body.metaData.items.THIS_YEAR.name = WRONG_SUBTITLE
//             res.send({ body: res.body })
//         })
//     })

//     // eslint-disable-next-line cypress/unsafe-to-chain-command
//     cy.get(gridItemSel)
//         .first()
//         .trigger('mousedown')
//         .trigger('mousemove', { clientX: 400 })
//         .trigger('mouseup')

//     // cy.get(gridItemSel)
//     //     .first()
//     //     .getIframeBody()
//     //     .find(chartSubtitleSel, EXTENDED_TIMEOUT)
//     //     .contains(WRONG_SUBTITLE)
//     //     .should('not.exist')
// })
