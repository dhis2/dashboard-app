import { getApiBaseUrl } from '../../support/server/utils'
import { dashboardsQuery } from '../../../src/api/dashboards'

const baseUrl = getApiBaseUrl()

describe('Dashboards', () => {
    it('Get all dashboards', () => {
        // const paging = dashboardsQuery.params.paging
        cy.log('dashboardsQuery.params.fields', dashboardsQuery.params.fields)
        cy.request(
            `${baseUrl}/api/${dashboardsQuery.resource}?fields=${dashboardsQuery.params.fields}&paging=false`
        ).then(response => {
            expect(response.body)
                .to.have.property('dashboards')
                .and.be.a('array')

            const dashboard = response.body.dashboards[0]
            expect(dashboard, 'has id as string')
                .to.have.property('id')
                .and.be.a('string')
            expect(dashboard, 'has name as string')
                .to.have.property('name')
                .and.be.a('string')
            expect(dashboard, 'has displayName as string')
                .to.have.property('displayName')
                .and.be.a('string')
            expect(dashboard, 'has favorite as string')
                .to.have.property('favorite')
                .and.be.a('boolean')
            expect(dashboard, 'has user as object')
                .to.have.property('user')
                .and.be.a('object')
            expect(dashboard, 'has created as string')
                .to.have.property('created')
                .and.be.a('string')
            expect(dashboard, 'has lastUpdated as string')
                .to.have.property('lastUpdated')
                .and.be.a('string')
            expect(dashboard, 'has access as object')
                .to.have.property('access')
                .and.be.a('object')
            expect(dashboard, 'has href as string')
                .to.have.property('href')
                .and.be.a('string')
            expect(dashboard, 'has dashboardItems as array')
                .to.have.property('dashboardItems')
                .and.be.a('array')

            // These props are not present if the field has no value
            // Consider making a request to create a dashboard with a description
            // expect(dashboard).to.have.property('description').and.be.a('string')
            // expect(dashboard).to.have.property('displayDescription').and.be.a('string')
        })
    })
})
