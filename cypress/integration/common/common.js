import { Given, Then } from 'cypress-cucumber-preprocessor/steps'
import { dashboardsBar } from '../../elements/dashboardsBar'
import { expectDashboardTitleToContain } from '../../elements/titleBar'
import { expectChartToExist } from '../../elements/dashboardItem'
import { expectUrlToMatch } from '../../elements/browserUrl'
import { dashboards } from '../../assets/backends'

beforeEach(() => {
    cy.visit('/', {
        timeout: 10000,
    })
})

Given('I open the {string} dashboard', title => {
    dashboardsBar.clickChip(title)
})

Then('the {string} dashboard displays in view mode', title => {
    expectUrlToMatch(dashboards[title].route)
    expectDashboardTitleToContain(title)
    expectChartToExist()
})
