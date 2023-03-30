import { enableAutoLogin, enableNetworkShim, isStubMode, networkModes } from '@dhis2/cypress-commands'

const getDefaultMode = () => {
  return networkModes.STUB
}

enableNetworkShim()

if (!isStubMode(getDefaultMode())) {
    // log in if using a live backend
    // High timeout as the app can take some time to load
    enableAutoLogin(undefined, { timeout: 20000 })
}

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})
