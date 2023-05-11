import {
    gridItemSel,
    chartSel,
    chartSubtitleSel,
} from '../elements/dashboardItem.js'
import {
    confirmActionDialogSel,
    titleInputSel,
    clickEditActionButton,
} from '../elements/editDashboard.js'
import {
    dashboardChipSel,
    dashboardTitleSel,
    titleBarSel,
} from '../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

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

export const addDashboardTitle = (title) => {
    cy.get(titleInputSel).type(title)
}

export const addDashboardItems = () => {
    cy.get('[data-test="item-search"]').click()
    cy.get('[data-test="menu-item-ANC: 1 and 3 coverage Yearly"]')
        .click()
        .closePopper()
}

export const continueEditing = () => {
    cy.get(confirmActionDialogSel)
        .find('button')
        .contains('No, stay here')
        .click()
}

export const saveDashboard = () => {
    clickEditActionButton('Save changes')
}

export const expectDashboardToDisplayInViewMode = (title) => {
    cy.location().should((loc) => {
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })

    // FIXME - from the old create_dashboard.js file
    // cy.get(`${gridItemSel}.VISUALIZATION`)
    //     .getIframeBody()
    //     .find(chartSel, EXTENDED_TIMEOUT)
    //     .should('be.visible')

    // Some map visualization load very slowly:
    // https://dhis2.atlassian.net/browse/DHIS2-14365
    //    cy.get(`${gridItemSel}.MAP`)
    //        .getIframeBody()
    //        .find(mapSel, EXTENDED_TIMEOUT)
    //        .should('be.visible')

    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
}

export const chooseToEditDashboard = () => {
    cy.get(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains('Edit', EXTENDED_TIMEOUT)
        .click()

    cy.get(titleInputSel).should('exist')

    cy.location().should((loc) => {
        expect(getRouteFromHash(loc.hash)).to.eq(ROUTE_EDIT)
    })
}

export const expectDifferentDashboardToDisplayInViewMode = (title) => {
    cy.location().should((loc) => {
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })
    cy.get(dashboardTitleSel).should('be.visible').and('not.contain', title)
}

export const openExistingDashboard = (title) => {
    cy.get(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()

    cy.location().should((loc) => {
        const currentRoute = getRouteFromHash(loc.hash)

        expect(nonViewRoutes).not.to.include(currentRoute)
        expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(currentRoute.length)
    })
    cy.get(dashboardTitleSel).should('be.visible').and('contain', title)
}

export const confirmCancelDelete = () => {
    cy.get(confirmActionDialogSel)
        .find('button')
        .contains('No, stay here')
        .click()
}

export const cancelDelete = () => {
    cy.get(confirmActionDialogSel).find('button').contains('Cancel').click()
}

// Then('the confirm delete dialog is displayed', () => {
export const expectConfirmDeleteDialogToBeDisplayed = (title) => {
    cy.contains(
        `Deleting dashboard "${title}" will remove it for all users`
    ).should('be.visible')
}

export const confirmDelete = () => {
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
}

export const expectDashboardToBeDeletedAndFirstStarredDashboardDisplayed = (
    title
) => {
    cy.get(dashboardChipSel).contains(title).should('not.exist')

    cy.get(dashboardTitleSel).should('exist').should('not.be.empty')
}

export const expectChartItemToBeDisplayed = () => {
    cy.get(`${gridItemSel}.VISUALIZATION`)
        .first()
        .getIframeBody()
        .find(chartSel, EXTENDED_TIMEOUT)
        .should('exist')
}

export const expectNoAnalyticsRequestsToBeMadeWhenItemIsMoved = () => {
    const WRONG_SUBTITLE = 'WRONG_SUBTITLE'
    cy.intercept(/analytics\.json(\S)*skipMeta=false/, (req) => {
        req.reply((res) => {
            // modify the chart subtitle so we can check whether the api request
            // was made. (It shouldn't be - that's the test)
            res.body.metaData.items.THIS_YEAR.name = WRONG_SUBTITLE
            res.send({ body: res.body })
        })
    })

    cy.get(gridItemSel)
        .first()
        .trigger('mousedown')
        .trigger('mousemove', { clientX: 400 })
        .trigger('mouseup')

    cy.get(gridItemSel)
        .first()
        .getIframeBody()
        .find(chartSubtitleSel, EXTENDED_TIMEOUT)
        .contains(WRONG_SUBTITLE)
        .should('not.exist')
}

export const expectDifferentDashboardDisplaysInViewMode = (title) => {
    cy.get(dashboardTitleSel).should('be.visible').and('not.contain', title)
}

// export const addMapAndChartThenSave = (title) => {
//     //add the title
//     cy.get('[data-test="dashboard-title-input"]').type(title)

//     // add items
//     cy.get('[data-test="item-search"]').click()
//     cy.get('[data-test="item-search"]')
//         .find('input')
//         .type('Inpatient', { force: true })

//     //chart
//     cy.get('[data-test="menu-item-Inpatient: BMI this year by districts"]')
//         .click()
//         .closePopper()

//     cy.get('[data-test="item-search"]').click()
//     cy.get('[data-test="item-search"]')
//         .find('input')
//         .type('ipt 2', { force: true })

//     //map
//     cy.get('[data-test="menu-item-ANC: IPT 2 Coverage this year"]')
//         .click()
//         .closePopper()

//     //move things so the dashboard is more compact
//     cy.get(`${gridItemSel}.MAP`)
//         .trigger('mousedown')
//         .trigger('mousemove', { clientX: 650 })
//         .trigger('mouseup')

//     //save
//     cy.get('button').contains('Save changes', EXTENDED_TIMEOUT).click()
// }
