import { When, Then } from '@badeball/cypress-cucumber-preprocessor'
import {
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
