import '@dhis2/cli-utils-cypress/support'

import { enableNetworkShim, loginAndPersistSession } from './server'

enableNetworkShim()
loginAndPersistSession()

beforeEach(() => {
    /*
        Cypress automatically clears all cookies between tests except cross domain cookies.
        When we are working with a remote instance, we need to clear the login cookie associated with the remote domain.
        Currently, calling clearCookies with domain:null is a workaround to get rid of the cross domain cookies.
        Related Cypress issue https://github.com/cypress-io/cypress/issues/408
    */
    // cy.clearCookies({ domain: null })
})
