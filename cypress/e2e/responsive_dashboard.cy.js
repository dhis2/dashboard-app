import { dimensionsModalSel } from '../elements/dashboardFilter.js'
import { addFilter } from '../helpers/add_filter.js'
import { clickOnFilterBadge } from '../helpers/dashboard_filter.js'
import {
    startNewDashboard,
    openDashboard,
    addDashboardItems,
    addDashboardTitle,
    chooseToEditDashboard,
    expectDashboardToDisplayInViewMode,
} from '../helpers/edit_dashboard.js'
import {
    goToPhoneLandscape,
    scrollDown,
    scrollToTop,
    expectEditControlBarNotVisible,
    expectEditControlBarVisible,
} from '../helpers/phone_landscape.js'
import {
    goToSmallScreen,
    expectSmallScreenView,
    expectSmallScreenEditView,
    expectWideScreenEditView,
    restoreWideScreen,
    expectWideScreenView,
    expectChangesAreStillThere,
    changeUrlToEdit,
} from '../helpers/responsive_dashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

describe('Responsive dashboard', () => {
    it.only('views a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard('Delivery')
        goToSmallScreen()
        expectSmallScreenView()
        restoreWideScreen()
        expectWideScreenView()
    })

    it('edits an existing dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard('Delivery')
        chooseToEditDashboard()
        addDashboardTitle('xyz')
        addDashboardItems(['VISUALIZATION'])
        goToSmallScreen()
        expectSmallScreenEditView()
        restoreWideScreen()
        expectWideScreenEditView()
        expectChangesAreStillThere('xyz')
    })

    it('creates a new dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        startNewDashboard()
        addDashboardTitle('xyz')
        addDashboardItems()
        goToSmallScreen()
        expectSmallScreenEditView()
        restoreWideScreen()
        expectWideScreenEditView()
        expectChangesAreStillThere('xyz')
    })

    // FIXME
    // it.skip('changes the url to new while in small screen', () => {
    //     cy.visit('/', EXTENDED_TIMEOUT)
    //     openDashboard('Delivery')
    //     goToSmallScreen()
    //     changeUrlToNew()
    //     expectDashboardDisplaysInDefaultViewMode('Delivery')
    // })

    it('changes the url to edit while in small screen', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard('Delivery')
        goToSmallScreen()
        changeUrlToEdit()
        expectDashboardToDisplayInViewMode('Delivery')
    })

    it('cannot edit dashboard filter while in small screen', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard('Delivery')
        addFilter('Period', 'Last 6 months')
        goToSmallScreen()
        clickOnFilterBadge('Period')

        // filter modal is not opened
        cy.getBySel(dimensionsModalSel, EXTENDED_TIMEOUT).should('not.exist')
    })

    // FIXME
    // it.skip('Dashboards bar scrolls away in phone landscape', () => {
    //     cy.visit('/', EXTENDED_TIMEOUT)
    //     openDashboard('Delivery')
    //     goToPhoneLandscape()
    //     scrollDown()
    //     expectDashboardsBarNotVisible()
    //     scrollToTop()
    //     expectDashboardsBarVisible()
    // })

    it('Edit bar scrolls away in phone landscape', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard('Delivery')
        chooseToEditDashboard()
        goToPhoneLandscape()
        scrollDown()
        expectEditControlBarNotVisible()
        scrollToTop()
        expectEditControlBarVisible()
    })
})
