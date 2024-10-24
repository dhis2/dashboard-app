import React from 'react'
import ReactDOM from 'react-dom'
import AppWrapper from '../AppWrapper.jsx'

jest.mock('@dhis2/analytics', () => ({
    ...jest.requireActual('@dhis2/analytics'),
    CachedDataQueryProvider: () => <div className="CachedDataQueryProvider" />,
}))
jest.mock('@dhis2/app-runtime-adapter-d2', () => {
    return {
        D2Shim: ({ children }) => children({ d2: {} }),
    }
})

jest.mock(
    '../components/App.jsx',
    () =>
        function MockApp() {
            return <div />
        }
)

jest.mock(
    '../components/SystemSettingsProvider.jsx',
    () =>
        function Mock() {
            return <div className="SystemSettingsProvider" />
        }
)
jest.mock(
    '../components/UserSettingsProvider.jsx',
    () =>
        function Mock() {
            return <div className="UserSettingsProvider" />
        }
)

test('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<AppWrapper />, div)
    ReactDOM.unmountComponentAtNode(div)
})
