import { createItemDetailsReducer } from '../itemDetailsReducer.js'

test('returns undefined appUrl when the app has no launchUrl (entrypoint)', () => {
    const reducer = createItemDetailsReducer({ name: 'My Plugin' })

    // the plugin reports its own route via appUrl, but there is nothing to open
    const state = reducer({}, { appUrl: '/some/route' })

    expect(state.appUrl).toBeUndefined()
})

test('builds the launchUrl-based appUrl for apps with an entrypoint', () => {
    const reducer = createItemDetailsReducer({ launchUrl: 'https://host/app' })

    const state = reducer({}, { appUrl: '/dashboard' })

    expect(state.appUrl).toBe('https://host/app/dashboard')
})

test('falls back to the launchUrl when no appUrl is provided', () => {
    const reducer = createItemDetailsReducer({ launchUrl: 'https://host/app' })

    const state = reducer({}, { itemTitle: 'X' })

    expect(state.appUrl).toBe('https://host/app')
})
