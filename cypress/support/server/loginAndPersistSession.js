import { getDefaultMode, isStubMode, getApiBaseUrl } from './utils.js'

const loginEndPoint = 'dhis-web-commons/security/login.action'
const login = () => {
    const username = Cypress.env('dhis2_username')
    const password = Cypress.env('dhis2_password')
    const loginUrl = Cypress.env('dhis2_base_url')
    // const loginAuth = `Basic ${btoa(`${username}:${password}`)}`

    return cy.request({
        url: `${loginUrl}/${loginEndPoint}`,
        method: 'POST',
        form: true,
        followRedirect: true,
        body: {
            j_username: username,
            j_password: password,
            '2fa_code': '',
        },
        // headers: { Authorization: loginAuth },
    })
}

export default function loginAndPersistSession(mode = getDefaultMode()) {
    const baseUrl = getApiBaseUrl()

    beforeEach(() => {
        // This ensures the app platform knows which URL to use even if REACT_APP_DHIS2_BASE_URL is undefined
        // It also ensures that the value from the cypress env is used instead of REACT_APP_DHIS2_BASE_URL
        localStorage.setItem('DHIS2_BASE_URL', baseUrl)

        Cypress.Cookies.preserveOnce('JSESSIONID')
    })

    // No need to login when using stubbed responses
    if (!isStubMode(mode)) {
        before(() => {
            // Persist this across tests so we don't have to login before each test
            // Cypress.Cookies.defaults({
            //     whitelist: 'JSESSIONID',
            // })

            Cypress.Cookies.debug(true)

            cy.clearCookie('JSESSIONID')

            // This will authenticate and set the session cookie
            // cy.login()  // cli-utils-cypress
            login()
        })
    }
}
