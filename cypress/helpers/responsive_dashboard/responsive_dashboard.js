import { dimensionsModalSel } from '../../elements/dashboardFilter.js'
import { titleInputSel } from '../../elements/editDashboard.js'
import { newButtonSel } from '../../elements/viewDashboard.js'
import { EXTENDED_TIMEOUT } from '../../support/utils.js'

export const goToSmallScreen = () => {
    cy.viewport(460, 600)
    // to account for debounced window resize
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
}

export const expectSmallScreenView = () => {
    //controlbar - no search dashboard field
    cy.getBySel(newButtonSel).should('not.be.visible')

    //titlebar - only the More button and the title
    cy.get('button').contains('Edit').should('not.be.visible')
    cy.get('button').contains('Share').should('not.be.visible')
    cy.get('button').contains('Add filter').should('not.be.visible')

    cy.get('button.small').contains('More').should('be.visible')
    cy.get('button').not('.small').contains('More').should('not.be.visible')
}

export const restoreWideScreen = () => {
    cy.viewport(950, 800)
    // to account for debounced window resize
    cy.wait(1000) // eslint-disable-line cypress/no-unnecessary-waiting
}

export const expectWideScreenView = () => {
    cy.getBySel(newButtonSel).should('be.visible')

    cy.get('button').contains('Edit').should('be.visible')
    cy.get('button').contains('Share').should('be.visible')
    cy.get('button').contains('Add filter').should('be.visible')

    cy.get('button').not('.small').contains('More').should('be.visible')
    cy.get('button.small').contains('More').should('not.be.visible')
}

export const expectSmallScreenEditView = () => {
    //no controlbar
    cy.contains('Save changes').should('not.be.visible')
    cy.contains('Exit without saving').should('not.be.visible')

    //notice box and no dashboard
    cy.contains('dashboards on small screens is not supported').should(
        'be.visible'
    )
    // no title or item grid
    cy.getBySel(titleInputSel).should('not.be.visible')
    cy.get('.react-grid-layout').should('not.be.visible')
}

export const expectWideScreenEditView = () => {
    //controlbar
    cy.get('button').contains('Save changes').should('be.visible')
    cy.get('button').contains('Exit without saving').should('be.visible')

    cy.getBySel(titleInputSel).scrollIntoView()
    cy.getBySel(titleInputSel).should('be.visible')
    cy.get('.react-grid-layout').should('be.visible')
}

export const expectChangesAreStillThere = (changes) => {
    cy.getBySel(titleInputSel).scrollIntoView()
    //title or item changes
    var re = new RegExp(changes, 'g')
    cy.getBySel(titleInputSel)
        .find('input')
        .should(($input) => {
            const val = $input.val()

            expect(val).to.match(re)
        })
}

export const changeUrlToNew = () => {
    const url = `${Cypress.config().baseUrl}/#/new`
    cy.window().then((win) => {
        win.location.assign(url)
        cy.wait(2000) // eslint-disable-line cypress/no-unnecessary-waiting
    })
}

// export const expectDashboardDisplaysInDefaultViewMode = (title) => {
//     cy.location().should((loc) => {
//         expect(loc.hash).to.equal('#/')
//     })

//     cy.getBySel(dashboardTitleSel).should('be.visible').and('contain', title)

//     cy.get(`${gridItemClass}.VISUALIZATION`)
//         .first()
//         .getIframeBody()
//         .find(chartClass, EXTENDED_TIMEOUT)
//         .should('be.visible')
// }

export const changeUrlToEdit = () => {
    cy.location().then((loc) => {
        const url = `${loc.href}/edit`
        cy.window().then((win) => {
            win.location.assign(url)
            cy.wait(2000) // eslint-disable-line cypress/no-unnecessary-waiting
        })
    })
}

export const expectFilterModalIsNotOpened = () => {
    cy.getBySel(dimensionsModalSel, EXTENDED_TIMEOUT).should('not.exist')
}
