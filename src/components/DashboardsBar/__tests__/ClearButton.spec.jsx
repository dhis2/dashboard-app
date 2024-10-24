import { render } from '@testing-library/react'
import React from 'react'
import ClearButton from '../ClearButton.jsx'

test('ClearButton renders a button', () => {
    const { container } = render(<ClearButton onClear={jest.fn()} />)
    expect(container).toMatchSnapshot()
})
