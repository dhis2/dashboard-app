import { render } from '@testing-library/react'
import React from 'react'
import FilterSettingsDialog from '../FilterSettingsDialog'

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: () => ({ isConnected: true }),
}))

jest.mock('@dhis2/ui', () => {
    const originalModule = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...originalModule,
        Modal: function MockComponent(props) {
            return <div className="modal">{props.children}</div> //eslint-disable-line react/prop-types
        },
        Transfer: function MockTransfer(props) {
            return (
                <div
                    className="transfer"
                    /* eslint-disable react/prop-types, react/no-unknown-property */
                    options={props.options
                        .map(option => `${option.label}`)
                        .join(', ')}
                    selecteddimensions={props.selected.join(', ')}
                    /* eslint-enable react/prop-types, react/no-unknown-property */
                />
            )
        },
    }
})

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

test('renders correctly when filters are not restricted', () => {
    const { container } = render(
        <FilterSettingsDialog
            restrictFilters={false}
            initiallySelectedItems={[]}
            open={true}
        />
    )
    expect(container).toMatchSnapshot()
})

test('renders correctly when filters are restricted', () => {
    const { container } = render(
        <FilterSettingsDialog
            restrictFilters={true}
            initiallySelectedItems={['kl']}
            open={true}
        />
    )
    expect(container).toMatchSnapshot()
})
