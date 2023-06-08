import {
    clickEditActionButton,
    addDashboardTitle,
    saveDashboard,
    openDashboard,
    startNewDashboard,
    chooseToEditDashboard,
    expectDashboardDisplaysInEditMode,
    // expectDashboardToBeSaved,
    expectConfirmDeleteDialogToBeDisplayed,
    expectDashboardToDisplayInViewMode,
    cancelDelete,
    confirmDelete,
    expectDifferentDashboardToDisplayInViewMode,
    expectChartItemToBeDisplayed,
    // expectNoAnalyticsRequestsToBeMadeWhenItemIsMoved,
    addDashboardItems,
    expectDashboardToBeDeletedAndFirstStarredDashboardDisplayed,
    starDashboard,
    unstarDashboard,
    expectDashboardToBeStarred,
    expectDashboardToNotBeStarred,
} from '../helpers/index.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('af')

describe.skip('Edit dashboard', () => {
    it('creates a new dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        startNewDashboard()
        addDashboardTitle(TEST_DASHBOARD_TITLE)
        addDashboardItems()
        saveDashboard()
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
    })

    it('exits without saving', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        clickEditActionButton('Exit without saving')
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
    })

    it('exits without saving when name changed', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        addDashboardTitle('xyz')
        clickEditActionButton('Exit without saving')
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
    })

    it('stars the dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        expectDashboardToNotBeStarred(TEST_DASHBOARD_TITLE)
        starDashboard()
        expectDashboardToBeStarred(TEST_DASHBOARD_TITLE)
        unstarDashboard()
        expectDashboardToNotBeStarred(TEST_DASHBOARD_TITLE)
    })

    // FIXME
    it.skip('toggles show description', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        // expectDashboardDescriptionNotToBeDisplayed()
        // showDashboardDescription()
        // expectDashboardDescriptionToBeDisplayed()
        // hideDashboardDescription()
        // expectDashboardDescriptionNotToBeDisplayed()
    })

    // FIXME
    it.skip('moves an item on a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        // FIXME
        expectChartItemToBeDisplayed()
        // expectNoAnalyticsRequestsToBeMadeWhenItemIsMoved()
    })

    // FIXME
    it.skip('changes sharing settings of a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        //     When I change sharing settings
        //     And I choose to edit dashboard
        //     And dashboard is saved
        //     Then the new sharing settings should be preserved
    })

    it('saves a starred dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        expectDashboardToNotBeStarred(TEST_DASHBOARD_TITLE)
        starDashboard()
        expectDashboardToBeStarred(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        saveDashboard()
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        expectDashboardToBeStarred(TEST_DASHBOARD_TITLE)
        unstarDashboard()
        expectDashboardToNotBeStarred(TEST_DASHBOARD_TITLE)
    })

    it('cancels a delete dashboard action', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        clickEditActionButton('Delete')
        expectConfirmDeleteDialogToBeDisplayed(TEST_DASHBOARD_TITLE)
        cancelDelete()
        expectDashboardDisplaysInEditMode(TEST_DASHBOARD_TITLE)
    })

    it('deletes a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        clickEditActionButton('Delete')
        expectConfirmDeleteDialogToBeDisplayed(TEST_DASHBOARD_TITLE)
        confirmDelete()
        expectDifferentDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        expectDashboardToBeDeletedAndFirstStarredDashboardDisplayed(
            TEST_DASHBOARD_TITLE
        )
    })
})
