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

describe('icons for EVENT_VISUALIZATION', () => {
    const renderIcon = (visType) => {
        const { container } = render(
            <ContentMenuItem
                name="Inpatient cases"
                type="EVENT_VISUALIZATION"
                url=""
                visType={visType}
                onInsert={jest.fn()}
            />
        )

        return container.querySelector('svg').innerHTML
    }

    it('distinguishes line lists from pivot tables', () => {
        // Both types share the group now, so the icon is what tells them apart
        expect(renderIcon('LINE_LIST')).not.toBe(renderIcon('PIVOT_TABLE'))
    })

    it('falls back to the item type icon when visType is missing', () => {
        // Older backends may not return the type in the search response, and
        // rendering an undefined icon component would throw
        expect(() => renderIcon(undefined)).not.toThrow()
        expect(renderIcon(undefined)).toBe(renderIcon('LINE_LIST'))
    })
})
