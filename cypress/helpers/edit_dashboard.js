import {
    mapClass,
    gridItemClass,
    chartClass,
    chartSubtitleClass,
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
    newButtonSel,
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

const expectViewRoute = (lochash) => {
    const route = getRouteFromHash(lochash)
    expect(nonViewRoutes).not.to.include(route)
    expect([ROOT_ROUTE_LENGTH, UID_LENGTH]).to.include(route.length)
}

export const addDashboardTitle = (title) => {
    cy.getBySel(titleInputSel).type(title)
}

export const addDashboardItems = (itemTypes = ['VISUALIZATION', 'MAP']) => {
    if (itemTypes.includes('VISUALIZATION')) {
        cy.getBySel('item-search').click()
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.getBySel('menu-item-ANC: 1 and 3 coverage Yearly')
            .click()
            .closePopper()
    }

    if (itemTypes.includes('MAP')) {
        cy.getBySel('item-search').click()
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.getBySel(
            'menu-item-ANC: 1st visit coverage (%) by district last year'
        )
            .click()
            .closePopper()

        if (itemTypes.includes('VISUALIZATION')) {
            //move things so the dashboard is more compact
            // eslint-disable-next-line cypress/unsafe-to-chain-command
            cy.get(`${gridItemClass}.MAP`)
                .trigger('mousedown')
                .trigger('mousemove', { clientX: 650 })
                .trigger('mouseup')
        }
    }
}

export const continueEditing = () => {
    cy.getBySel(confirmActionDialogSel)
        .find('button')
        .contains('No, stay here')
        .click()
}

export const saveDashboard = () => {
    clickEditActionButton('Save changes')
}

export const openDashboard = (title, itemTypes = ['VISUALIZATION']) => {
    cy.getBySel(dashboardChipSel, EXTENDED_TIMEOUT).contains(title).click()

    cy.location().should((loc) => expectViewRoute(loc.hash))
    cy.getBySel(dashboardTitleSel).should('be.visible').and('contain', title)

    if (itemTypes.includes('VISUALIZATION')) {
        expectChartItemToBeDisplayed()
        // cy.get(`${gridItemClass}.VISUALIZATION`, EXTENDED_TIMEOUT)
        //     .first()
        //     .getIframeBody()
        //     .find(chartClass, EXTENDED_TIMEOUT)
        //     .should('exist')
    }
}

export const startNewDashboard = () => {
    cy.getBySel(newButtonSel, EXTENDED_TIMEOUT).click()
}

export const expectDifferentDashboardToDisplayInViewMode = (title) => {
    cy.location().should((loc) => expectViewRoute(loc.hash))
    cy.getBySel(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', title)
}

export const expectDashboardToDisplayInViewMode = (title, itemTypes = []) => {
    cy.location().should((loc) => expectViewRoute(loc.hash))

    if (itemTypes.includes('VISUALIZATION')) {
        expectChartItemToBeDisplayed()
    }

    if (itemTypes.includes('MAP')) {
        expectMapItemToBeDisplayed()
    }

    // FIXME which of these is better?
    cy.getBySel(dashboardTitleSel).should('have.text', title)
    cy.getBySel(dashboardTitleSel).should('be.visible').and('contain', title)
}

export const expectChartItemToBeDisplayed = () => {
    cy.get(`${gridItemClass}.VISUALIZATION`, EXTENDED_TIMEOUT)
        .first()
        .getIframeBody()
        .find(chartClass, EXTENDED_TIMEOUT)
        .should('be.visible')
}

const expectMapItemToBeDisplayed = () => {
    // Some map visualization load very slowly:
    // https://dhis2.atlassian.net/browse/DHIS2-14365
    cy.get(`${gridItemClass}.MAP`)
        .first()
        .getIframeBody()
        .find(mapClass, EXTENDED_TIMEOUT)
        .should('be.visible')
}

export const chooseToEditDashboard = () => {
    cy.getBySel(titleBarSel, EXTENDED_TIMEOUT)
        .find('button')
        .contains('Edit', EXTENDED_TIMEOUT)
        .click()

    expectDashboardDisplaysInEditMode()
}

export const expectDashboardDisplaysInEditMode = () => {
    cy.getBySel(titleInputSel).should('be.visible')

    cy.location().should((loc) => {
        expect(getRouteFromHash(loc.hash)).to.eq(ROUTE_EDIT)
    })
}

export const confirmCancelDelete = () => {
    cy.getBySel(confirmActionDialogSel)
        .find('button')
        .contains('No, stay here')
        .click()
}

export const cancelDelete = () => {
    cy.getBySel(confirmActionDialogSel)
        .find('button')
        .contains('Cancel')
        .click()
}

export const expectConfirmDeleteDialogToBeDisplayed = (title) => {
    cy.contains(
        `Deleting dashboard "${title}" will remove it for all users`
    ).should('be.visible')
}

export const confirmDelete = () => {
    cy.getBySel(confirmActionDialogSel)
        .find('button')
        .contains('Delete')
        .click()
}

export const expectDashboardToBeDeletedAndFirstStarredDashboardDisplayed = (
    title
) => {
    cy.getBySel(dashboardChipSel).contains(title).should('not.exist')
    cy.getBySel(dashboardTitleSel).should('exist').should('not.be.empty')
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

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get(gridItemClass)
        .first()
        .trigger('mousedown')
        .trigger('mousemove', { clientX: 400 })
        .trigger('mouseup')

    cy.get(gridItemClass)
        .first()
        .getIframeBody()
        .find(chartSubtitleClass, EXTENDED_TIMEOUT)
        .contains(WRONG_SUBTITLE)
        .should('not.exist')
}

export const expectDifferentDashboardDisplaysInViewMode = (title) => {
    cy.getBySel(dashboardTitleSel)
        .should('be.visible')
        .and('not.contain', title)
}
