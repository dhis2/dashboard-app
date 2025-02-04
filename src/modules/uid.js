//  Copied from https://github.com/dhis2/d2/blob/master/src/uid.js

const abc = 'abcdefghijklmnopqrstuvwxyz'
const letters = abc.concat(abc.toUpperCase())

const ALLOWED_CHARS = `0123456789${letters}`

const NUMBER_OF_CODEPOINTS = ALLOWED_CHARS.length
const CODESIZE = 11

function randomWithMax(max) {
    return Math.floor(Math.random() * max)
}

export function generateUid() {
    // First char should be a letter
    let randomChars = letters.charAt(randomWithMax(letters.length))

    for (let i = 1; i < CODESIZE; i += 1) {
        randomChars += ALLOWED_CHARS.charAt(randomWithMax(NUMBER_OF_CODEPOINTS))
    }

    // return new String( randomChars );
    return randomChars
}

const CODE_PATTERN = /^[a-zA-Z]{1}[a-zA-Z0-9]{10}$/
export const isValidUid = (code) => (code ? CODE_PATTERN.test(code) : false)
