import { render } from '@testing-library/react'
import React from 'react'
import ContentMenuItem from '../ContentMenuItem.jsx'

test('ContentMenuItem has a LaunchLink when url is provided', () => {
    const props = {
        name: 'Rainbow Dash',
        type: 'pony',
        url: 'http://ponies-r-us.com',
        visType: 'BAR',
        onInsert: jest.fn(),
    }

    const { queryByLabelText } = render(<ContentMenuItem {...props} />)

    expect(queryByLabelText('Open visualization in new tab')).toBeTruthy()
})

test('does not have LaunchLink if no url provided', () => {
    const props = {
        name: 'Fancy chart',
        type: 'VISUALIZATION',
        url: '',
        visType: 'BAR',
        onInsert: jest.fn(),
    }
    const { queryByLabelText } = render(<ContentMenuItem {...props} />)

    expect(queryByLabelText('Open visualization in new tab')).toBeNull()
})
