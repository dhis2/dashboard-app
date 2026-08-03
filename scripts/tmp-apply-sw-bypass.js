// TEMPORARY investigation script - not for merging.
// Injects a service-worker CDP bypass into the top-level `before()` hook so
// we can A/B test whether the SW is causing the description/slideshow
// cross-spec CI flake, without touching the app's own PWA config.
const fs = require('fs')

const path = 'cypress/support/e2e.js'
const marker = 'before(() => {'
const injected = `before(() => {
    Cypress.automation('remote:debugger:protocol', {
        command: 'Network.enable',
    }).then(() => {
        return Cypress.automation('remote:debugger:protocol', {
            command: 'Network.setBypassServiceWorker',
            params: { bypass: true },
        })
    })
`

let content = fs.readFileSync(path, 'utf8')
if (!content.includes(marker)) {
    throw new Error(`Marker not found in ${path}`)
}
content = content.replace(marker, injected)
fs.writeFileSync(path, content)
console.log('SW bypass injected into cypress/support/e2e.js')
