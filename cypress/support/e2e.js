import 'cypress-real-events'
import './commands.js'

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

// TEMP INVESTIGATION - capture network/console activity and dump it via
// cy.task on test failure so it's visible in CI logs. Not for merging.
let requestLog = []
let consoleLog = []

Cypress.on('window:before:load', (win) => {
    const wrap =
        (level) =>
        (...args) => {
            consoleLog.push(`[${level}] ${args.map(String).join(' ')}`)
        }
    win.console.error = wrap('error')
    win.console.warn = wrap('warn')
})

beforeEach(() => {
    requestLog = []
    consoleLog = []
    cy.intercept('**', (req) => {
        req.on('response', (res) => {
            requestLog.push(`${res.statusCode} ${req.method} ${req.url}`)
        })
        req.on('error', (err) => {
            requestLog.push(`ERROR ${req.method} ${req.url}: ${err.message}`)
        })
    })
})

afterEach(function () {
    if (this.currentTest?.state === 'failed') {
        cy.window({ log: false }).then((win) => {
            cy.task(
                'logDebugInfo',
                {
                    test: this.currentTest.fullTitle(),
                    localStorageBaseUrl: win.localStorage.getItem(
                        LOCAL_STORAGE_KEY
                    ),
                    cookies: win.document.cookie,
                    consoleLog,
                    requestLog,
                },
                { log: false }
            )
        })
    }
})

before(() => {
    const username = Cypress.env('dhis2Username')
    const password = Cypress.env('dhis2Password')
    const baseUrl = Cypress.env('dhis2BaseUrl')
    const instanceVersion = Cypress.env('dhis2InstanceVersion')

    cy.loginByApi({ username, password, baseUrl })
        .its('status')
        .should('equal', 200)

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
