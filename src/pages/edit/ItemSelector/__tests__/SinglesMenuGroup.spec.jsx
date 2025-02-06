import { render } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import SinglesMenuGroup from '../SinglesMenuGroup.jsx'

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

    const { container, queryByText } = render(
        <Provider store={mockStore(store)}>
            <SinglesMenuGroup {...props} />
        </Provider>
    )

    expect(queryByText('ponies')).toBeTruthy()
    expect(queryByText('Rainbow Dash')).toBeTruthy()
    expect(queryByText('Twilight')).toBeTruthy()

    const listItems = container.querySelectorAll('li')
    expect(listItems).toHaveLength(3)
    expect(listItems[0].getAttribute('class')).toContain('disabled')
    expect(listItems[1].getAttribute('class')).not.toContain('disabled')
    expect(listItems[2].getAttribute('class')).not.toContain('disabled')
})
