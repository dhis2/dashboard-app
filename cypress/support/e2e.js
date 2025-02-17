// import '@dhis2/cypress-commands'
import { enableAutoLogin } from '@dhis2/cypress-commands'
import 'cypress-real-events'
import './commands.js'

enableAutoLogin()

// const LOGIN_ENDPOINT = 'dhis-web-commons-security/login.action'
const SESSION_COOKIE_NAME = 'JSESSIONID'
const LOCAL_STORAGE_KEY = 'DHIS2_BASE_URL'

// '2.39' or 39?
const computeEnvVariableName = (instanceVersion) =>
    typeof instanceVersion === 'number'
        ? `${SESSION_COOKIE_NAME}_${instanceVersion}`
        : `${SESSION_COOKIE_NAME}_${instanceVersion.split('.').pop()}`

const findSessionCookieForBaseUrl = (baseUrl, cookies) =>
    cookies.find(
        (cookie) =>
            cookie.name === SESSION_COOKIE_NAME && baseUrl.includes(cookie.path)
    )

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
Cypress.on('uncaught:exception', (err) => {
    /* returning false here prevents Cypress from failing the test */
    if (resizeObserverLoopErrRe.test(err.message)) {
        return false
    }
})

before(() => {
    const baseUrl = Cypress.env('dhis2BaseUrl')
    const instanceVersion = Cypress.env('dhis2InstanceVersion')

    cy.getAllCookies()
        .should((cookies) => {
            expect(cookies.length).to.be.at.least(1)
        })
        .then((cookies) => {
            const sessionCookieForBaseUrl = findSessionCookieForBaseUrl(
                baseUrl,
                cookies
            )
            Cypress.env(
                computeEnvVariableName(instanceVersion),
                JSON.stringify(sessionCookieForBaseUrl)
            )
        })
})

beforeEach(() => {
    const baseUrl = Cypress.env('dhis2BaseUrl')
    const instanceVersion = Cypress.env('dhis2InstanceVersion')
    const hideRequestsFromLog = Cypress.env('hideRequestsFromLog')
    const envVariableName = computeEnvVariableName(instanceVersion)
    const { name, value, ...options } = JSON.parse(Cypress.env(envVariableName))

    if (hideRequestsFromLog) {
        // disable Cypress's default behavior of logging all XMLHttpRequests and fetches
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, baseUrl)
    cy.setCookie(name, value, options)

    cy.getAllCookies().should((cookies) => {
        expect(findSessionCookieForBaseUrl(baseUrl, cookies)).to.exist
        expect(localStorage.getItem(LOCAL_STORAGE_KEY)).to.equal(baseUrl)
    })
})
