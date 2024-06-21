import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import {
    dashboardTitleSel,
    dashboardsBarContainerSel,
    showMoreLessSel,
} from '../../../elements/viewDashboard.js'
import { getApiBaseUrl, EXTENDED_TIMEOUT } from '../../../support/utils.js'

const MIN_DASHBOARDS_BAR_HEIGHT = 71
const MAX_DASHBOARDS_BAR_HEIGHT = 431

const RESP_CODE_200 = 200
const RESP_CODE_201 = 201

beforeEach(() => {
    cy.request({
        method: 'PUT',
        url: `${getApiBaseUrl()}/api/userDataStore/dashboard/controlBarRows`,
        headers: {
            'content-type': 'application/json',
        },
        body: '1',
    }).then((response) =>
        expect(response.status).to.be.oneOf([RESP_CODE_201, RESP_CODE_200])
    )
})

When('I toggle show more dashboards', () => {
    cy.get(showMoreLessSel).click()
})

Given('I type an invalid dashboard id in the browser url', () => {
    cy.visit('#/invalid', EXTENDED_TIMEOUT)
})

Then('a message displays informing that the dashboard is not found', () => {
    cy.contains('Requested dashboard not found', EXTENDED_TIMEOUT).should(
        'be.visible'
    )
    cy.get(dashboardTitleSel).should('not.exist')
})
Then('the control bar should be at collapsed height', () => {
    cy.get(dashboardsBarContainerSel, EXTENDED_TIMEOUT)
        .invoke('height')
        .should('eq', MIN_DASHBOARDS_BAR_HEIGHT)
})

Then('the control bar should be expanded to full height', () => {
    cy.get(dashboardsBarContainerSel, EXTENDED_TIMEOUT)
        .invoke('height')
        .should('eq', MAX_DASHBOARDS_BAR_HEIGHT)
})
