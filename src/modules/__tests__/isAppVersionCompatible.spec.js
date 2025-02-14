import { isLLVersionCompatible } from '../isAppVersionCompatible.js'

const testcases = [
    ['102.0.0', true],
    ['100.5.9', false],
    ['102.2.0', true],
    ['100.0.9', false],
    ['102.2.0-alpha', true],
    ['100.5.9-beta', false],
]

describe('isLLVersionCompatible', () => {
    testcases.forEach(([version, expected]) => {
        test(`returns ${expected} for ${version}`, () => {
            expect(isLLVersionCompatible(version)).toBe(expected)
        })
    })
})
