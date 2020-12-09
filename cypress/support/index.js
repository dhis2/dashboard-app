import { enableAutoLogin } from '@dhis2/cypress-commands'

import { enableNetworkShim, loginAndPersistSession } from './server'

enableAutoLogin()
enableNetworkShim()
loginAndPersistSession()
