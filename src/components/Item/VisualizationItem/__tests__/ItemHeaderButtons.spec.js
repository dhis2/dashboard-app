import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import ItemHeaderButtons from '../ItemHeaderButtons'

jest.mock('../Visualization/plugin', () => ({
    getLink: () => 'http://rainbowdash',
    pluginIsAvailable: () => true,
}))

it('renders correctly when not fullscreen', () => {
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
    expect(toJson(buttons)).toMatchSnapshot()
})

it('renders correctly when fullscreen', () => {
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
            isFullscreen={true}
        />
    )
    expect(toJson(buttons)).toMatchSnapshot()
})
