import React from 'react'
import { shallow } from 'enzyme'
import ItemHeaderButtons from '../ItemHeaderButtons'

jest.mock('../plugin', () => ({
    getLink: () => 'http://rainbowdash',
    pluginIsAvailable: () => true,
}))

it('renders correctly', () => {
    const buttons = shallow(
        <ItemHeaderButtons
            item={{
                type: 'CHART',
                chart: { type: 'NOT_YOY', domainType: 'AGGREGATE' },
            }}
            visualization={{
                type: 'SINGLE_VALUE',
            }}
            onSelectActiveType={Function.prototype}
            activeFooter={false}
            activeType={'CHART'}
            d2={{}}
            onToggleFooter={Function.prototype}
        />
    )
    expect(buttons).toMatchSnapshot()
})
