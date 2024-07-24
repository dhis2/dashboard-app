import '@dhis2/cypress-commands'

const LOGIN_ENDPOINT = 'dhis-web-commons-security/login.action'
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

// Define a Cypress command to get the body of an iframe
const sleep = (timeout) =>
    new Promise((resolve) => setTimeout(resolve, timeout))

Cypress.Commands.add(
    'getIframeBody',
    { prevSubject: 'element' },
    (subject, iframeSelector = 'iframe') => {
        cy.wrap(subject)
            .find(iframeSelector)
            .then({ timeout: 30000 }, async ($iframe) => {
                if ($iframe.length !== 1) {
                    console.error('more than 1 iframe', $iframe.length)
                    throw new Error(
                        `getIframeBody command can only be applied to one iframe at a time. Instead found ${$iframe.length}`
                    )
                }

                const contentWindow = $iframe.prop('contentWindow')

                while (contentWindow.location.toString() === 'about:blank') {
                    console.log('wait for iframe location')
                    await sleep(100)
                }

                if (contentWindow.document.readyState === 'complete') {
                    console.log('return body', contentWindow.document.body)
                    return contentWindow.document.body
                }

                await new Promise((resolve) => {
                    Cypress.$(contentWindow).on('load', resolve)
                })

                console.log(
                    'return body after promise',
                    contentWindow.document.body
                )

                return contentWindow.document.body
            })
            .then(cy.wrap)
    }
)

before(() => {
    const username = Cypress.env('dhis2Username')
    const password = Cypress.env('dhis2Password')
    const baseUrl = Cypress.env('dhis2BaseUrl')
    const instanceVersion = Cypress.env('dhis2InstanceVersion')

    cy.request({
        url: `${baseUrl}/${LOGIN_ENDPOINT}`,
        method: 'POST',
        form: true,
        followRedirect: true,
        body: {
            j_username: username,
            j_password: password,
            '2fa_code': '',
        },
    }).should((response) => {
        expect(response.status).to.eq(200)
    })

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
    const envVariableName = computeEnvVariableName(instanceVersion)
    const { name, value, ...options } = JSON.parse(Cypress.env(envVariableName))

    localStorage.setItem(LOCAL_STORAGE_KEY, baseUrl)
    cy.setCookie(name, value, options)

    cy.getAllCookies().should((cookies) => {
        expect(findSessionCookieForBaseUrl(baseUrl, cookies)).to.exist
        expect(localStorage.getItem(LOCAL_STORAGE_KEY)).to.equal(baseUrl)
    })
})
