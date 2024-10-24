import { render } from '@testing-library/react'
import React from 'react'
import FilterSettingsDialog from '../FilterSettingsDialog.jsx'

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: () => ({ isConnected: true }),
}))

/* eslint-disable react/prop-types, react/no-unknown-property */
jest.mock('@dhis2/ui', () => {
    const originalModule = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...originalModule,
        Modal: function Mock(props) {
            return <div className="ui-Modal">{props.children}</div>
        },
        Transfer: function MockTransfer(props) {
            return (
                <div
                    className="ui-Transfer"
                    options={props.options
                        .map((option) => `${option.label}`)
                        .join(', ')}
                    selecteddimensions={props.selected.join(', ')}
                />
            )
        },
        Button: function Mock({ children }) {
            return <div className="ui-Button">{children}</div>
        },
        //eslint-disable-next-line no-unused-vars
        Radio: function Mock({ checked, dense, ...props }) {
            return (
                <div className="ui-Radio" data-checked={checked} {...props} />
            )
        },
        ButtonStrip: function Mock({ children }) {
            return <div className="ui-ButtonStrip">{children}</div>
        },
        ModalActions: function Mock({ children }) {
            return <div className="ui-ModalActions">{children}</div>
        },
        ModalContent: function Mock({ children }) {
            return <div className="ui-ModalContent">{children}</div>
        },
        ModalTitle: function Mock({ children }) {
            return <div className="ui-ModalTitle">{children}</div>
        },
    }
})
/* eslint-enable react/prop-types, react/no-unknown-property */

jest.mock('../../../modules/useDimensions.js', () => ({
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
