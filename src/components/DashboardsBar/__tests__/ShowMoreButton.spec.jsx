import { fireEvent } from '@testing-library/dom'
import { render } from '@testing-library/react'
import React from 'react'
import ShowMoreButton from '../ShowMoreButton.jsx'

describe('ShowMoreButton', () => {
    it('renders correctly when at maxHeight', () => {
        const { container } = render(
            <ShowMoreButton
                onClick={() => {}}
                isMaxHeight={true}
                classes={{ showMore: {} }}
            />
        )
        expect(container).toMatchSnapshot()
    })

    it('renders correctly when not at maxHeight', () => {
        const { container } = render(
            <ShowMoreButton
                onClick={() => {}}
                isMaxHeight={false}
                classes={{ showMore: {} }}
            />
        )

        expect(container).toMatchSnapshot()
    })

    it('triggers onClick when button clicked', () => {
        const onClick = jest.fn()
        const { getByLabelText } = render(
            <ShowMoreButton
                onClick={onClick}
                isMaxHeight={false}
                classes={{ showMore: {} }}
            />
        )
        fireEvent.click(getByLabelText('Show more dashboards'))
        expect(onClick).toHaveBeenCalled()
    })
})
