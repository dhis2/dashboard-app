import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import SinglesMenuGroup from '../SinglesMenuGroup.js'

const mockStore = configureMockStore()

test('renders SingleMenuGroup', () => {
    const store = {}

    const props = {
        category: {
            header: 'ponies',
            items: [
                {
                    type: 'colorful',
                    name: 'Rainbow Dash',
                },
                {
                    type: 'greytone',
                    name: 'Twilight',
                },
            ],
        },
    }

    const { container } = render(
        <Provider store={mockStore(store)}>
            <SinglesMenuGroup {...props} />
        </Provider>
    )
    expect(container).toMatchSnapshot()
})
