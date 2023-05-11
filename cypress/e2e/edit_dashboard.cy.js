import { clickEditActionButton } from '../elements/editDashboard.js'
import { dashboardTitleSel } from '../elements/viewDashboard.js'
import {
    addDashboardTitle,
    saveDashboard,
    openExistingDashboard,
    chooseToEditDashboard,
    // expectDashboardToBeSaved,
    expectConfirmDeleteDialogToBeDisplayed,
    expectDashboardToDisplayInViewMode,
    cancelDelete,
    confirmDelete,
    expectDifferentDashboardToDisplayInViewMode,
    // expectChartItemToBeDisplayed,
    // expectNoAnalyticsRequestsToBeMadeWhenItemIsMoved,
    addDashboardItems,
    expectDashboardToBeDeletedAndFirstStarredDashboardDisplayed,
} from '../helpers/edit_dashboard.js'
import { clickExitWithoutSaving } from '../helpers/helpers.js'
import { expectDashboardDisplaysInEditMode } from '../helpers/helpers2.js'
import {
    starDashboard,
    unstarDashboard,
    expectDashboardToBeStarred,
    expectDashboardToNotBeStarred,
} from '../helpers/star_dashboard.js'
import { startNewDashboard } from '../helpers/start_new_dashboard.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('af')

describe('Edit dashboard', () => {
    it('creates a new dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        startNewDashboard()
        addDashboardTitle(TEST_DASHBOARD_TITLE)
        addDashboardItems()
        saveDashboard()
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        cy.get(dashboardTitleSel).should('have.text', TEST_DASHBOARD_TITLE)
    })

    it('exits without saving', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        clickExitWithoutSaving()
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
    })

    it('exits without saving when name changed', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        addDashboardTitle('xyz')
        clickExitWithoutSaving()
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
    })

    it('stars the dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        expectDashboardToNotBeStarred(TEST_DASHBOARD_TITLE)
        starDashboard()
        expectDashboardToBeStarred(TEST_DASHBOARD_TITLE)
        unstarDashboard()
        expectDashboardToNotBeStarred(TEST_DASHBOARD_TITLE)
    })

    // FIXME
    it.skip('toggles show description', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        // expectDashboardDescriptionNotToBeDisplayed()
        // showDashboardDescription()
        // expectDashboardDescriptionToBeDisplayed()
        // hideDashboardDescription()
        // expectDashboardDescriptionNotToBeDisplayed()
    })

    // FIXME
    it.skip('moves an item on a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        // FIXME
        // expectChartItemToBeDisplayed()
        // expectNoAnalyticsRequestsToBeMadeWhenItemIsMoved()
    })

    // FIXME
    it.skip('changes sharing settings of a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        //     When I change sharing settings
        //     And I choose to edit dashboard
        //     And dashboard is saved
        //     Then the new sharing settings should be preserved
    })

    it('saves a starred dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
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
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        clickEditActionButton('Delete')
        expectConfirmDeleteDialogToBeDisplayed(TEST_DASHBOARD_TITLE)
        cancelDelete()
        expectDashboardDisplaysInEditMode(TEST_DASHBOARD_TITLE)
    })

    it('deletes a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
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
