import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import FilterSettingsDialog from '../FilterSettingsDialog'

jest.mock('../../../modules/useDimensions', () => ({
    __esModule: true,
    default: () => {
        return [
            { id: 'kl', name: 'kvikk lunsj' },
            { id: 'ss', name: 'salt sild' },
            { id: 'sm', name: 'seigmenn' },
        ]
    },
}))

const mockSelectedItems = ['kl']

it('renders correctly when filters are not restricted', () => {
    const container = shallow(
        <FilterSettingsDialog
            restrictFilters={false}
            initiallySelectedItems={[]}
            open={true}
        />
    )
    expect(toJson(container)).toMatchSnapshot()
})

it('renders correctly when filters are restricted', () => {
    const container = shallow(
        <FilterSettingsDialog
            restrictFilters={true}
            initiallySelectedItems={mockSelectedItems}
            open={true}
        />
    )
    expect(toJson(container)).toMatchSnapshot()
})
