export * from './dashboardFilter.js'
export * from './dashboardItem.js'
export * from './editDashboard.js'
export * from './navigationMenu.js'
export * from './sharingDialog.js'
export * from './viewDashboard.js'

export const closeModal = () =>
    cy.getByDataTest('dhis2-uicore-layer').click('topLeft')

// the length of the root route of the app (after the slash): #/
const ROOT_ROUTE_LENGTH = 0
// the length of UIDs (after the slash): '#/nghVC4wtyzi'
const UID_LENGTH = 11

const ROUTE_EDIT = 'edit'
const ROUTE_NEW = 'new'
const ROUTE_PRINTLAYOUT = 'printlayout'
const ROUTE_PRINTOIPP = 'printoipp'
const nonViewRoutes = [
    ROUTE_NEW,
    ROUTE_EDIT,
    ROUTE_PRINTLAYOUT,
    ROUTE_PRINTOIPP,
]

const getRouteFromHash = (hash) => {
    const lastSlashIdx = hash.lastIndexOf('/')
    return hash.slice(lastSlashIdx + 1)
}

export const assertValidRoute = () => {
    cy.location().should((loc) => {
        const currentRoute = getRouteFromHash(loc.hash)
        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })
}
