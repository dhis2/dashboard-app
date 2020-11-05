import { registerCommands } from '@dhis2/cypress-commands'

import { enableNetworkShim, loginAndPersistSession } from './server'

import './commands'

registerCommands()
enableNetworkShim()
loginAndPersistSession()
