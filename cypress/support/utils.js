export const EXTENDED_TIMEOUT = { timeout: 15000 }

export const getApiBaseUrl = () => {
    const baseUrl = Cypress.env('dhis2_base_url') || ''

    if (!baseUrl) {
        throw new Error(
            'No `dhis2_base_url` found. Please make sure to add it to `cypress.env.json`'
        )
    }

    return baseUrl
}

export const goOffline = () => {
    cy.log('**go offline**')
        .then(() => {
            return Cypress.automation('remote:debugger:protocol', {
                command: 'Network.enable',
            })
        })
        .then(() => {
            return Cypress.automation('remote:debugger:protocol', {
                command: 'Network.emulateNetworkConditions',
                params: {
                    offline: true,
                    latency: -1,
                    downloadThroughput: -1,
                    uploadThroughput: -1,
                },
            })
        })
}

export const goOnline = () => {
    // disable offline mode, otherwise we will break our tests :)
    cy.log('**go online**')
        .then(() => {
            return Cypress.automation('remote:debugger:protocol', {
                command: 'Network.emulateNetworkConditions',
                params: {
                    offline: false,
                    latency: -1,
                    downloadThroughput: -1,
                    uploadThroughput: -1,
                },
            })
        })
        .then(() => {
            return Cypress.automation('remote:debugger:protocol', {
                command: 'Network.disable',
            })
        })
}
