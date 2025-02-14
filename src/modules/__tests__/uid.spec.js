import { generateUid, isValidUid } from '../uid.js'

describe('generateUid', () => {
    it('should generate a UID that is a string', () => {
        const uid = generateUid()
        expect(typeof uid).toBe('string')
    })

    it('should generate a UID of correct length', () => {
        const uid = generateUid()
        expect(uid.length).toBe(11)
    })

    it('should generate a UID that matches the expected pattern', () => {
        const uid = generateUid()
        expect(isValidUid(uid)).toBe(true)
    })

    it('should generate unique UIDs', () => {
        const uid1 = generateUid()
        const uid2 = generateUid()
        expect(uid1).not.toBe(uid2)
    })

    it('should generate a UID with the first character as a letter', () => {
        const uid = generateUid()
        const firstChar = uid.charAt(0)
        expect(/[a-zA-Z]/.test(firstChar)).toBe(true)
    })
})

describe('isValidUid', () => {
    it('should return false for an invalid UID', () => {
        expect(isValidUid('1234567890')).toBe(false) // Does not start with a letter
        expect(isValidUid('a123456789')).toBe(false) // Too short
        expect(isValidUid('a123456789012')).toBe(false) // Too long
        expect(isValidUid('a12345678!0')).toBe(false) // Contains invalid character
    })

    it('should return true for a valid UID', () => {
        expect(isValidUid('a1234567890')).toBe(true)
    })
})
