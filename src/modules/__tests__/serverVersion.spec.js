import { systemHasIdv } from '../serverVersion.js'

describe('systemHasIdv', () => {
    test.each([
        [{ major: 2, minor: 43, patch: 3 }],
        [{ major: 2, minor: 43, patch: 4, tag: 'SNAPSHOT' }],
        [{ major: 2, minor: 44, patch: 0 }],
        [{ major: 2, minor: 44 }],
    ])('is true for %o', (serverVersion) => {
        expect(systemHasIdv(serverVersion)).toBe(true)
    })

    test.each([
        [{ major: 2, minor: 43, patch: 2 }],
        [{ major: 2, minor: 43 }],
        [{ major: 2, minor: 42, patch: 5 }],
    ])('is false for %o', (serverVersion) => {
        expect(systemHasIdv(serverVersion)).toBe(false)
    })

    test('is false when the server version is missing', () => {
        expect(systemHasIdv(undefined)).toBe(false)
    })
})
