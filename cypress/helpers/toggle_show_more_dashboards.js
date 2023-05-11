import {
    dashboardTitleSel,
    dashboardsBarContainerSel,
} from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT, getApiBaseUrl } from '../support/utils.js'

const MIN_DASHBOARDS_BAR_HEIGHT = 71
const MAX_DASHBOARDS_BAR_HEIGHT = 431

beforeEach(() => {
    cy.request({
        method: 'PUT',
        url: `${getApiBaseUrl()}/api/userDataStore/dashboard/controlBarRows`,
        headers: {
            'content-type': 'application/json',
        },
        body: '1',
    }).then((response) => expect(response.status).to.equal(201))
})

export const expectDashboardNotFoundMessage = () => {
    cy.contains('Requested dashboard not found', EXTENDED_TIMEOUT).should(
        'be.visible'
    )
    cy.get(dashboardTitleSel).should('not.exist')
}

export const expectControlBarToBeAtCollapsedHeight = () => {
    cy.get(dashboardsBarContainerSel, EXTENDED_TIMEOUT)
        .invoke('height')
        .should('eq', MIN_DASHBOARDS_BAR_HEIGHT)
}

export const expectControlBarToBeExpandedToFullHeight = () => {
    cy.get(dashboardsBarContainerSel, EXTENDED_TIMEOUT)
        .invoke('height')
        .should('eq', MAX_DASHBOARDS_BAR_HEIGHT)
}
