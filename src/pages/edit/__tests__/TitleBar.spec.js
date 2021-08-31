import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import TitleBar from '../TitleBar'

const mockStore = configureMockStore()

jest.mock(
    '../ItemSelector/ItemSelector',
    () =>
        function MockItemSelector() {
            return <div className="item-selector" />
        }
)

describe('TitleBar', () => {
    it('renders correctly with name and description', () => {
        const store = {
            editDashboard: {
                name: 'Rainbow Dash',
                description: 'A very colorful pony',
            },
        }
        const { container } = render(
            <Provider store={mockStore(store)}>
                <TitleBar />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })

    it('renders correctly when no name or description', () => {
        const store = {
            editDashboard: {
                name: '',
                description: '',
            },
        }

        const { container } = render(
            <Provider store={mockStore(store)}>
                <TitleBar />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
})
