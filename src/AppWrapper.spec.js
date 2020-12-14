import React from 'react'
import ReactDOM from 'react-dom'
import AppWrapper from './AppWrapper'

jest.mock(
    './components/App',
    () =>
        function MockApp() {
            return <div />
        }
)
jest.mock('@dhis2/app-runtime-adapter-d2', () => {
    return {
        D2Shim: ({ children }) => children({ d2: {} }),
    }
})

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<AppWrapper />, div)
    ReactDOM.unmountComponentAtNode(div)
})
