import { isLLVersionCompatible } from '../isLLVersionCompatible.js'

describe('isLLVersionCompatible', () => {
    test('returns true if version greater than minLLVersion', () => {
        expect(isLLVersionCompatible('100.6.1')).toBe(true)
    })

    test('returns false if version less than minLLVersion', () => {
        expect(isLLVersionCompatible('100.5.9')).toBe(false)
    })

    test('returns true if version is same as minLLVersion', () => {
        expect(isLLVersionCompatible('100.6.0')).toBe(true)
    })
})
