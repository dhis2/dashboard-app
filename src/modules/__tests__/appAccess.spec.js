import { hasAppAccess } from '../appAccess.js'

describe('hasAppAccess', () => {
    test.each(['ALL', 'M_dhis-web-app-management'])(
        'grants access to any app with the %s authority',
        (authority) => {
            expect(hasAppAccess('data-visualizer', [authority])).toBe(true)
            expect(hasAppAccess('my-plugin', [authority])).toBe(true)
        }
    )

    test('grants access to a bundled app with its authority', () => {
        expect(
            hasAppAccess('data-visualizer', ['M_dhis-web-data-visualizer'])
        ).toBe(true)
    })

    test('grants access to an installed app with its authority', () => {
        // short name: line-listing
        expect(hasAppAccess('line-listing', ['M_linelisting'])).toBe(true)
        // short name: My plugin
        expect(hasAppAccess('My-plugin', ['M_My_plugin'])).toBe(true)
        // short name: my-plugin v2
        expect(hasAppAccess('my-plugin-v2', ['M_myplugin_v2'])).toBe(true)
    })

    test('denies access without the app authority', () => {
        expect(hasAppAccess('data-visualizer', ['M_dhis-web-maps'])).toBe(false)
        expect(hasAppAccess('my-plugin', ['M_myplugin2'])).toBe(false)
        expect(hasAppAccess('my-plugin', ['M_my-plugin'])).toBe(false)
        expect(hasAppAccess('plugin', ['M_myplugin'])).toBe(false)
        expect(hasAppAccess('my-plugin', ['M_MYPLUGIN'])).toBe(false)
    })

    test('denies access when authorities are missing', () => {
        expect(hasAppAccess('my-plugin')).toBe(false)
        expect(hasAppAccess('my-plugin', [])).toBe(false)
    })

    test('grants access when there is no app key', () => {
        expect(hasAppAccess(undefined, [])).toBe(true)
    })

    test('does not treat regular expression characters in the app key as patterns', () => {
        expect(hasAppAccess('my.plugin', ['M_myxplugin'])).toBe(false)
    })
})
