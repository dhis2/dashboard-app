import { enableAutoLogin } from '@dhis2/cypress-commands'

import './commands.js'

enableAutoLogin(undefined, { timeout: 20000 })

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
            .find(iframeSelector, { timeout: 45000 })
            .then({ timeout: 45000 }, async ($iframe) => {
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
