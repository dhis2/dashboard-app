import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

import EditTitleBar from '../EditTitleBar'

const mockStore = configureMockStore()

jest.mock('../../ItemSelector/ItemSelector', () => 'ItemSelector')

describe('EditTitleBar', () => {
    it('renders correctly with name and description', () => {
        const store = {
            editDashboard: {
                name: 'Rainbow Dash',
                description: 'A very colorful pony',
            },
        }
        const { container } = render(
            <Provider store={mockStore(store)}>
                <EditTitleBar />
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
                <EditTitleBar />
            </Provider>
        )
        expect(container).toMatchSnapshot()
    })
})
