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
