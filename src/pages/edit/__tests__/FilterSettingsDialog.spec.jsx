import { render } from '@testing-library/react'
import React from 'react'
import FilterSettingsDialog from '../FilterSettingsDialog.jsx'

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: () => ({ isConnected: true }),
}))

jest.mock('@dhis2/ui', () => {
    const originalModule = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...originalModule,
        Modal: function Mock({ children }) /* NOSONAR */ {
            return <div className="ui-Modal">{children}</div>
        },
        Transfer: function MockTransfer(props) /* NOSONAR */ {
            return (
                <div
                    className="ui-Transfer"
                    options={props.options // NOSONAR
                        .map((option) => `${option.label}`) // NOSONAR
                        .join(', ')}
                    selecteddimensions={props.selected.join(', ')} // NOSONAR
                />
            )
        },
        Button: function Mock({ children }) /* NOSONAR */ {
            return <div className="ui-Button">{children}</div>
        },
        Radio: function Mock({ checked, dense, ...props }) /* NOSONAR */ {
            return (
                <div className="ui-Radio" data-checked={checked} {...props} />
            )
        },
        ButtonStrip: function Mock({ children }) /* NOSONAR */ {
            return <div className="ui-ButtonStrip">{children}</div>
        },
        ModalActions: function Mock({ children }) /* NOSONAR */ {
            return <div className="ui-ModalActions">{children}</div>
        },
        ModalContent: function Mock({ children }) /* NOSONAR */ {
            return <div className="ui-ModalContent">{children}</div>
        },
        ModalTitle: function Mock({ children }) /* NOSONAR */ {
            return <div className="ui-ModalTitle">{children}</div>
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
