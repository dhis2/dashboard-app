import React from 'react'
import ReactDOM from 'react-dom'
import AppWrapper from '../AppWrapper.js'

jest.mock('@dhis2/app-runtime-adapter-d2', () => {
    return {
        D2Shim: ({ children }) => children({ d2: {} }),
    }
})

jest.mock(
    '../components/App',
    () =>
        function MockApp() {
            return <div />
        }
)

jest.mock(
    '../components/SystemSettingsProvider.js',
    () =>
        function Mock() {
            return <div className="SystemSettingsProvider" />
        }
)
jest.mock(
    '../components/UserSettingsProvider.js',
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
