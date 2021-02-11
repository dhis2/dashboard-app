import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import ItemHeaderButtons from '../ItemHeaderButtons'
import { useSystemSettings } from '../../../SystemSettingsProvider'

jest.mock('../Visualization/plugin', () => ({
    getLink: () => 'http://rainbowdash',
    pluginIsAvailable: () => true,
}))

jest.mock('@dhis2/analytics', () => ({
    isSingleValue: () => {
        return false
    },
    isYearOverYear: () => {
        return false
    },
}))

jest.mock('../../../SystemSettingsProvider', () => ({
    useSystemSettings: jest.fn(),
}))

const mockSystemSettingsDefault = {
    settings: {
        openInRelevantApp: true,
        showInterpretationsAndDetails: true,
        switchViewType: true,
        fullscreenAllowedInSettings: true,
    },
}

it('renders correctly when not fullscreen', () => {
    useSystemSettings.mockImplementationOnce(() => mockSystemSettingsDefault)
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
    useSystemSettings.mockImplementationOnce(() => mockSystemSettingsDefault)
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

it('renders Menu Items when open', () => {
    useSystemSettings.mockImplementationOnce(() => mockSystemSettingsDefault)
    const container = shallow(
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
            isFullscreen={false}
            fullscreenSupported={true}
            isOpen={true}
        />
    )

    expect(toJson(container)).toMatchSnapshot()
})

it('does not render ViewAsMenuItems Items if settings do not allow', () => {
    const mockSystemSettings = { settings: {} }
    mockSystemSettings.settings = Object.assign(
        {},
        mockSystemSettingsDefault.settings,
        {
            switchViewType: false,
        }
    )
    useSystemSettings.mockImplementationOnce(() => mockSystemSettings)
    const container = shallow(
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
            isFullscreen={false}
            fullscreenSupported={true}
            isOpen={true}
        />
    )
    expect(container.find('ViewAsMenuItems').exists()).toBeFalsy()
})

it('does not let you open in relevant app if settings do not allow', () => {
    const mockSystemSettings = { settings: {} }
    mockSystemSettings.settings = Object.assign(
        {},
        mockSystemSettingsDefault.settings,
        {
            openInRelevantApp: false,
        }
    )
    useSystemSettings.mockImplementationOnce(() => mockSystemSettings)
    const container = shallow(
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
            isFullscreen={false}
            fullscreenSupported={true}
            isOpen={true}
        />
    )
    expect(
        container
            .findWhere(
                n =>
                    n.name() === 'MenuItem' &&
                    n.prop('label') === 'Open in Data Visualizer app'
            )
            .exists()
    ).toBeFalsy()
})

it('does not let you open in fullscreen if settings do not allow', () => {
    const mockSystemSettings = { settings: {} }
    mockSystemSettings.settings = Object.assign(
        {},
        mockSystemSettingsDefault.settings,
        {
            fullscreenAllowedInSettings: false,
        }
    )
    useSystemSettings.mockImplementationOnce(() => mockSystemSettings)
    const container = shallow(
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
            isFullscreen={false}
            fullscreenSupported={true}
            isOpen={true}
        />
    )
    expect(
        container
            .findWhere(
                n =>
                    n.name() === 'MenuItem' &&
                    n.prop('label') === 'View fullscreen'
            )
            .exists()
    ).toBeFalsy()
})

it('does not let you open interpretations and details if settings do not allow', () => {
    const mockSystemSettings = { settings: {} }
    mockSystemSettings.settings = Object.assign(
        {},
        mockSystemSettingsDefault.settings,
        {
            showInterpretationsAndDetails: false,
        }
    )
    useSystemSettings.mockImplementationOnce(() => mockSystemSettings)
    const container = shallow(
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
            isFullscreen={false}
            fullscreenSupported={true}
            isOpen={true}
        />
    )
    expect(
        container
            .findWhere(
                n =>
                    n.name() === 'MenuItem' &&
                    n.prop('label') === 'Show interpretations and details'
            )
            .exists()
    ).toBeFalsy()
})

it('does not render buttons if all relevant settings are false', () => {
    const mockSystemSettings = {
        settings: {
            openInRelevantApp: false,
            showInterpretationsAndDetails: false,
            switchViewType: false,
            fullscreenAllowedInSettings: false,
        },
    }

    useSystemSettings.mockImplementationOnce(() => mockSystemSettings)
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
            isFullscreen={false}
            fullscreenSupported={true}
            isOpen={true}
        />
    )
    expect(toJson(buttons)).toBeFalsy()
})
