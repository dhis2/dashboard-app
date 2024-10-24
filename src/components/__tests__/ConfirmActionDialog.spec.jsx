import { render } from '@testing-library/react'
import React from 'react'
import ConfirmActionDialog from '../ConfirmActionDialog.jsx'

/* eslint-disable react/prop-types */
jest.mock('@dhis2/ui', () => {
    const originalModule = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...originalModule,
        Modal: function Mock(props) {
            return <div className="ui-Modal">{props.children}</div>
        },
        Button: function Mock({ children }) {
            return <div className="ui-Button">{children}</div>
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
/* eslint-enable react/prop-types */

test('ConfirmActionDialog renders confirm delete dialog', () => {
    const { container } = render(
        <ConfirmActionDialog
            title="Delete dashboard"
            message="Deleting dashboard Twilight Sparkle will remove it for all users. This action cannot be undone. Are you sure you want to permanently delete this dashboard?"
            cancelLabel="Cancel"
            confirmLabel="Delete"
            onConfirm={jest.fn()}
            onCancel={jest.fn()}
            open={true}
        />
    )
    expect(container).toMatchSnapshot()
})

test('ConfirmActionDialog renders discard changes dialog', () => {
    const { container } = render(
        <ConfirmActionDialog
            title="Discard changes"
            message="This dashboard has unsaved changes. Are you sure you want to leave and discard these unsaved changes?"
            cancelLabel="No, stay here"
            confirmLabel="Yes, discard changes"
            onConfirm={jest.fn()}
            onCancel={jest.fn()}
            open={true}
        />
    )
    expect(container).toMatchSnapshot()
})

test('ConfirmActionDialog does not render dialog if not open', () => {
    const { container } = render(
        <ConfirmActionDialog
            onConfirm={jest.fn()}
            onCancel={jest.fn()}
            open={false}
        />
    )
    expect(container).toMatchSnapshot()
})
