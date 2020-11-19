import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboardsBar } from '../../elements/dashboardsBar'
import { expectDashboardTitleToContain } from '../../elements/titleBar'
import { expectChartToExist } from '../../elements/dashboardItem'

// const deliveryDashboardRoute = '#/iMnYyBfSxmM'

beforeEach(() => {
    cy.visit('/', {
        timeout: 10000,
    })
})

Given('I open the {string} dashboard', title => {
    dashboardsBar.clickChip(title)
})

Then('the {string} dashboard displays in view mode', title => {
    // cy.checkUrlLocation(deliveryDashboardRoute)
    expectDashboardTitleToContain(title)
    expectChartToExist()
})
