import { getApiBaseUrl } from '../../support/server/utils'
import { dashboardQuery } from '../../../src/api/dashboards'
import { dashboards as dashboardData } from '../../assets/backends/sierraLeone_236'

const baseUrl = getApiBaseUrl()

it('Gets a selected dashboard', () => {
    // `fields=
    // id,
    // name,
    // displayName,
    // description,
    // displayDescription,
    // favorite,
    // user[id,displayName~rename(name)],
    // created,
    // lastUpdated,
    // access,
    // href,
    // dashboardItems[
    //     id,
    //     type,
    //     shape,
    //     x,
    //     y,
    //     width~rename(w),
    //     height~rename(h),
    //     messages,
    //     text,
    //     appKey,
    //     reports[type,id,displayName~rename(name)],
    //     resources[id,displayName~rename(name)],
    //     users[id,displayName~rename(name)],
    //     reportTable[id,displayName~rename(name),displayDescription~rename(description)],
    //     chart[type,id,displayName~rename(name),displayDescription~rename(description)],
    //     map[id,displayName~rename(name),displayDescription~rename(description)],
    //     eventReport[id,displayName~rename(name),displayDescription~rename(description)],
    //     eventChart[id,displayName~rename(name),displayDescription~rename(description)]`
    const dashboardId = dashboardData['Antenatal Care'].id
    cy.request(
        `${baseUrl}/api/${dashboardQuery.resource}/${dashboardId}?fields=${dashboardQuery.params.fields}`
    ).then(response => {
        const dashboard = response.body
        expect(dashboard).to.be.a('object')
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
    })
})
