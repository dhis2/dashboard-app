import NetworkShim from './Networkshim.js'
import { isDisabledMode, isCaptureMode, getApiBaseUrl } from './utils.js'
import visitWithUnfetchOverwriteFn from './visitWithUnfetchOverwriteFn.js'

export default function enableNetworkShim(hosts = [getApiBaseUrl()]) {
    // No need to stub anything when disabled
    if (isDisabledMode()) {
        return
    }
    // Replace window.fetch with unfetch, which uses XHR and cypress can work with this
    Cypress.Commands.overwrite('visit', visitWithUnfetchOverwriteFn)

    const networkShim = new NetworkShim(hosts)

    before(() => {
        if (isCaptureMode()) {
            networkShim.initCaptureMode()
        } else {
            networkShim.initStubMode()
        }
    })

    beforeEach(() => {
        if (isCaptureMode()) {
            networkShim.captureRequestsAndResponses()
        } else {
            networkShim.createStubRoutes()
        }
    })

    after(() => {
        if (isCaptureMode()) {
            networkShim.writeFile()
        }
    })
}
