import { enableAutoLogin } from '@dhis2/cypress-commands'
import { enableNetworkShim } from './server'
import { getDefaultMode, isStubMode } from './server/utils.js'

enableNetworkShim()

if (!isStubMode(getDefaultMode())) {
    // log in if using a live backend
    enableAutoLogin()
}
