import React from 'react'
import ReactDOM from 'react-dom'
import AppWrapper from './AppWrapper'

jest.mock('./components/App', () => () => <div />)

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<AppWrapper />, div)
    ReactDOM.unmountComponentAtNode(div)
})
