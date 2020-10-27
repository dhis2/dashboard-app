import {
    API_STUB_MODES,
    DEFAULT_API_STUB_MODE,
    NETWORK_FIXTURES_FILE_PATH,
} from './constants.js'

export const getApiBaseUrl = () => {
    const baseUrl = Cypress.env('dhis2_base_url') || ''

    if (!baseUrl) {
        throw new Error(
            'No `dhis2_base_url` found. Please make sure to add it to `cypress.env.json`'
        )
    }

    return baseUrl
}

export const getDefaultMode = () =>
    Cypress.env('dhis2_api_stub_mode') || DEFAULT_API_STUB_MODE

export const isDisabledMode = () =>
    Cypress.env('dhis2_api_stub_mode') === API_STUB_MODES.DISABLED

export const isCaptureMode = () =>
    Cypress.env('dhis2_api_stub_mode') === API_STUB_MODES.CAPTURE

export const isStubMode = () =>
    Cypress.env('dhis2_api_stub_mode') === API_STUB_MODES.STUB

export const getFileName = () => NETWORK_FIXTURES_FILE_PATH
