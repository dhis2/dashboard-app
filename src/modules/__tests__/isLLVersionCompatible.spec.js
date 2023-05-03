import { isLLVersionCompatible } from '../isLLVersionCompatible.js'

const testcases = [
    ['100.6.1', true],
    ['100.5.9', false],
    ['100.6.0', true],
    ['101.0.0', true],
    ['100.0.9', false],
]

describe('isLLVersionCompatible', () => {
    testcases.forEach(([version, expected]) => {
        test(`returns ${expected} for ${version}`, () => {
            expect(isLLVersionCompatible(version)).toBe(expected)
        })
    })
})
