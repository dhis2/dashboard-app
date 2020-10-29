import '@dhis2/cli-utils-cypress/support'

import { enableNetworkShim, loginAndPersistSession } from './server'

enableNetworkShim()
loginAndPersistSession()
