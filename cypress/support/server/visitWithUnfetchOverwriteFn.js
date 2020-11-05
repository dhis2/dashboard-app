const visitWithUnfetchOverwriteFn = (originalFn, url, options = {}) =>
    cy.readFile('cypress/assets/unfetch.umd.js', { log: false }).then(content =>
        originalFn(url, {
            ...options,
            onBeforeLoad: win => {
                delete win.fetch
                win.eval(content)
                win.fetch = win.unfetch
                options.onBeforeLoad && options.onBeforeLoad(win)
            },
        })
    )

export default visitWithUnfetchOverwriteFn
