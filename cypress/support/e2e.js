import { enableAutoLogin } from '@dhis2/cypress-commands'
import { enableNetworkShim } from './server/index.js'
import { getDefaultMode, isStubMode } from './server/utils.js'

enableNetworkShim()

if (!isStubMode(getDefaultMode())) {
    // log in if using a live backend
    enableAutoLogin()
}

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})
