export const expectUrlToMatch = name => {
    cy.location().should(loc => {
        expect(loc.hash).to.equal(name)
    })
}
