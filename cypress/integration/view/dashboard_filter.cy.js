import { confirmActionDialogSel } from '../../elements/editDashboard.js'
import { newButtonSel } from '../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../support/utils.js'
import { addFilter } from '../common/view/add_a_FILTERTYPE_filter.js'
import { openDashboardEditMode } from '../common/view/choose_to_edit_dashboard.js'
import { clickFilterBadge } from '../common/view/click_on_the_FILTERTYPE_filter_badge.js'
import {
    addMapAndChart,
    openCreatedDashboard,
    dashboardDisplaysInViewMode,
    differentDashboardDisplayed,
} from './dashboard_filter/create_dashboard.js'
import {
    assertPeriodFilterApplied,
    assertOrgUnitFilterApplied,
    assertFacilityFilterApplied,
    assertFilterModalOpen,
} from './dashboard_filter/dashboard_filter.js'

describe('Dashboard filtering', () => {
    // When I start a new dashboard
    // And I add a MAP and a CHART and save
    // Then the dashboard displays in view mode
    // When I add a "Period" filter
    //         Then the Period filter is applied to the dashboard
    test('I add a period filter', () => {
        cy.get(newButtonSel, EXTENDED_TIMEOUT).click()
        addMapAndChart()
        dashboardDisplaysInViewMode()
        addFilter('Period')
        assertPeriodFilterApplied()
    })

    // Given I open existing dashboard
    // Then the dashboard displays in view mode
    // When I add a "Organisation unit" filter
    // Then the Organisation unit filter is applied to the dashboard
    test('I add an Organisation unt filter', () => {
        openCreatedDashboard()
        dashboardDisplaysInViewMode()
        addFilter('Organisation unit')
        assertOrgUnitFilterApplied()
    })

    // Given I open existing dashboard
    // Then the dashboard displays in view mode
    // When I add a "Facility Type" filter
    // Then the Facility Type filter is applied to the dashboard
    test('I add a Facility Type filter', () => {
        openCreatedDashboard()
        dashboardDisplaysInViewMode()
        assertFacilityFilterApplied()
    })

    // Given I open existing dashboard
    // When I add a Period filter
    // And I click on the Period filter badge
    // Then the filter modal is opened
    test('I can access the dimensions modal from the filter badge', () => {
        openCreatedDashboard()
        addFilter('Period')
        clickFilterBadge('Period')
        assertFilterModalOpen('Period')
    })

    // Given I open existing dashboard
    // When I choose to edit dashboard
    // And I choose to delete dashboard
    // When I confirm delete
    // Then different dashboard displays in view mode
    test('I delete a dashboard', () => {
        openCreatedDashboard()
        openDashboardEditMode()
        cy.get('[data-test="delete-dashboard-button"]').click()
        cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
        differentDashboardDisplayed()
    })
})
