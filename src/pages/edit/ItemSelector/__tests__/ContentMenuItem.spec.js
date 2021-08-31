import { render } from '@testing-library/react'
import React from 'react'
import ContentMenuItem from '../ContentMenuItem'

test('ContentMenuItem has a LaunchLink when url is provided', () => {
    const props = {
        name: 'Rainbow Dash',
        type: 'pony',
        url: 'http://ponies-r-us.com',
        visType: 'BAR',
        onInsert: jest.fn(),
    }

    const { container } = render(<ContentMenuItem {...props} />)

    expect(container).toMatchSnapshot()
})

test('does not have LaunchLink if no url provided', () => {
    const props = {
        name: 'Fancy chart',
        type: 'VISUALIZATION',
        url: '',
        visType: 'BAR',
        onInsert: jest.fn(),
    }
    const { container } = render(<ContentMenuItem {...props} />)
    expect(container).toMatchSnapshot()
})
