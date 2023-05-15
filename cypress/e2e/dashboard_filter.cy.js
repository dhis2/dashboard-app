import { dimensionsModalSel } from '../elements/dashboardFilter.js'
import { gridItemClass } from '../elements/dashboardItem.js'
import { clickEditActionButton } from '../elements/editDashboard.js'
import { newButtonSel } from '../elements/viewDashboard.js'
import { addFilter } from '../helpers/add_filter.js'
import {
    expectFacilityTypeFilterToBeApplied,
    expectOrganisationUnitFilterToBeApplied,
    expectPeriodFilterToBeApplied,
    clickOnFilterBadge,
} from '../helpers/dashboard_filter.js'
import {
    confirmDelete,
    openDashboard,
    chooseToEditDashboard,
    expectDashboardToDisplayInViewMode,
    expectDifferentDashboardDisplaysInViewMode,
} from '../helpers/edit_dashboard.js'
import { EXTENDED_TIMEOUT, createDashboardTitle } from '../support/utils.js'

const TEST_DASHBOARD_TITLE = createDashboardTitle('af')

const LAST_6_MONTHS = 'Last 6 months'
const SIERRA_LEONE_OU_ID = 'ImspTQPwCqd'
const FACILITY_TYPE_CLINIC = 'Clinic'

describe('Dashboard filter', () => {
    it('adds a period filter', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        cy.getBySel(newButtonSel, EXTENDED_TIMEOUT).click()

        // Add title
        cy.getBySel('dashboard-title-input').type(TEST_DASHBOARD_TITLE)

        // search for items
        cy.getBySel('item-search').click()
        cy.getBySel('item-search')
            .find('input')
            .type('Inpatient', { force: true })

        //chart
        cy.getBySel('menu-item-Inpatient: BMI this year by districts')
            .click()
            .closePopper()

        cy.getBySel('item-search').click()
        cy.getBySel('item-search').find('input').type('ipt 2', { force: true })

        //map
        cy.getBySel('menu-item-ANC: IPT 2 Coverage this year')
            .click()
            .closePopper()

        //move things so the dashboard is more compact
        cy.get(`${gridItemClass}.MAP`)
            .trigger('mousedown')
            .trigger('mousemove', { clientX: 650 })
            .trigger('mouseup')

        //save
        cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()

        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        addFilter('Period', LAST_6_MONTHS)
        expectPeriodFilterToBeApplied()
    })

    it('adds an organisation unit filter', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        addFilter('Organisation unit', SIERRA_LEONE_OU_ID)
        expectOrganisationUnitFilterToBeApplied()
    })

    it('adds a facility type filter', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        addFilter('Facility Type', FACILITY_TYPE_CLINIC)
        expectFacilityTypeFilterToBeApplied()
    })

    it('opens the dimensions modal from the filter badge', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
        addFilter('Period', LAST_6_MONTHS)
        clickOnFilterBadge('Period')
        cy.getBySel(dimensionsModalSel, EXTENDED_TIMEOUT).should('be.visible')
    })

    it('deletes a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        clickEditActionButton('Delete')
        confirmDelete()
        expectDifferentDashboardDisplaysInViewMode(TEST_DASHBOARD_TITLE)
    })
})