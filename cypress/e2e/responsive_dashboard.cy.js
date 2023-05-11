import { clickOnFilterBadge } from '../helpers/click_on_the_FILTERTYPE_filter_badge.js'
import {
    addDashboardItems,
    addDashboardTitle,
    chooseToEditDashboard,
} from '../helpers/edit_dashboard.js'
import { addFilter } from '../helpers/helpers.js'
import { openSLDashboard } from '../helpers/open_the_SL_dashboard.js'
import {
    goToPhoneLandscape,
    scrollDown,
    scrollToTop,
    expectDashboardsBarNotVisible,
    expectDashboardsBarVisible,
    expectEditControlBarNotVisible,
    expectEditControlBarVisible,
} from '../helpers/responsive_dashboard/phone_landscape.js'
import {
    goToSmallScreen,
    expectSmallScreenView,
    expectSmallScreenEditView,
    expectWideScreenEditView,
    restoreWideScreen,
    expectWideScreenView,
    expectFilterModalIsNotOpened,
    expectChangesAreStillThere,
    changeUrlToNew,
    changeUrlToEdit,
    expectDashboardDisplaysInDefaultViewMode,
} from '../helpers/responsive_dashboard/responsive_dashboard.js'
import { expectSLDashboardToDisplayInViewMode } from '../helpers/SL_dashboard_displays_in_view_mode.js'
import { startNewDashboard } from '../helpers/start_new_dashboard.js'
import { EXTENDED_TIMEOUT } from '../support/utils.js'

describe('Responsive dashboard', () => {
    it('views a dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        goToSmallScreen()
        expectSmallScreenView()
        restoreWideScreen()
        expectWideScreenView()
    })

    it('edits an existing dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        chooseToEditDashboard()
        addDashboardTitle('xyz')
        addDashboardItems()
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
        goToSma
        llScreen()
        expectSmallScreenEditView()
        restoreWideScreen()
        expectWideScreenEditView()
        expectChangesAreStillThere('xyz')
    })

    // FIXME
    it.skip('changes the url to new while in small screen', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        goToSmallScreen()
        changeUrlToNew()
        expectDashboardDisplaysInDefaultViewMode('Delivery')
    })

    it('changes the url to edit while in small screen', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        goToSmallScreen()
        changeUrlToEdit()
        expectSLDashboardToDisplayInViewMode('Delivery')
    })

    it('cannot edit dashboard filter while in small screen', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        addFilter('Period')
        goToSmallScreen()
        clickOnFilterBadge('Period')
        expectFilterModalIsNotOpened()
    })

    // FIXME
    it.skip('Dashboards bar scrolls away in phone landscape', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        goToPhoneLandscape()
        scrollDown()
        expectDashboardsBarNotVisible()
        scrollToTop()
        expectDashboardsBarVisible()
    })

    it('Edit bar scrolls away in phone landscape', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        chooseToEditDashboard()
        goToPhoneLandscape()
        scrollDown()
        expectEditControlBarNotVisible()
        scrollToTop()
        expectEditControlBarVisible()
    })
})
