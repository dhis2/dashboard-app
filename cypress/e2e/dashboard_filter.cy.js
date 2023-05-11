import { gridItemSel } from '../elements/dashboardItem.js'
import { clickEditActionButton } from '../elements/editDashboard.js'
import { newButtonSel } from '../elements/viewDashboard.js'
import { clickOnFilterBadge } from '../helpers/click_on_the_FILTERTYPE_filter_badge.js'
import {
    expectFacilityTypeFilterToBeApplied,
    expectOrganisationUnitFilterToBeApplied,
    expectPeriodFilterToBeApplied,
    expectFilterModalIsOpened,
} from '../helpers/dashboard_filter.js'
import {
    confirmDelete,
    openExistingDashboard,
    expectDashboardToDisplayInViewMode,
    expectDifferentDashboardDisplaysInViewMode,
} from '../helpers/edit_dashboard.js'
import { addFilter } from '../helpers/helpers.js'
import { chooseToEditDashboard } from '../helpers/helpers2.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('af')

describe('Dashboard filter', () => {
    it('adds a period filter', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        cy.get(newButtonSel, EXTENDED_TIMEOUT).click()

        // Add title
        cy.get('[data-test="dashboard-title-input"]').type(TEST_DASHBOARD_TITLE)

        // search for items
        cy.get('[data-test="item-search"]').click()
        cy.get('[data-test="item-search"]')
            .find('input')
            .type('Inpatient', { force: true })

        //chart
        cy.get('[data-test="menu-item-Inpatient: BMI this year by districts"]')
            .click()
            .closePopper()

        cy.get('[data-test="item-search"]').click()
        cy.get('[data-test="item-search"]')
            .find('input')
            .type('ipt 2', { force: true })

        //map
        cy.get('[data-test="menu-item-ANC: IPT 2 Coverage this year"]')
            .click()
            .closePopper()

        //move things so the dashboard is more compact
        cy.get(`${gridItemSel}.MAP`)
            .trigger('mousedown')
            .trigger('mousemove', { clientX: 650 })
            .trigger('mouseup')

        //save
        cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()

        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        addFilter('Period')
        expectPeriodFilterToBeApplied()
    })

    it('adds an organisation unit filter', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        addFilter('Organisation unit')
        expectOrganisationUnitFilterToBeApplied()
    })

    it('adds a facility type filter', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        addFilter('Facility Type')
        expectFacilityTypeFilterToBeApplied()
    })

    it('opens the dimensions modal from the filter badge', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        addFilter('Period')
        clickOnFilterBadge('Period')
        expectFilterModalIsOpened()
    })

    it('deletes a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openExistingDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        clickEditActionButton('Delete')
        confirmDelete()
        expectDifferentDashboardDisplaysInViewMode(TEST_DASHBOARD_TITLE)
    })
})
