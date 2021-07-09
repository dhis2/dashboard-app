/* eslint-disable react/prop-types */
import { render } from '@test.skiping-library/react'
import React from 'react'
import ConfirmActionDialog from '../ConfirmActionDialog'

jest.mock('@dhis2/ui', () => {
    const originalModule = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...originalModule,
        Modal: function MockComponent(props) {
            return <div>{props.children}</div>
        },
    }
})

test.skip('ConfirmActionDialog renders confirm delete dialog', () => {
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

test.skip('ConfirmActionDialog renders discard changes dialog', () => {
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

test.skip('ConfirmActionDialog does not render dialog if not open', () => {
    const { container } = render(
        <ConfirmActionDialog
            onConfirm={jest.fn()}
            onCancel={jest.fn()}
            open={false}
        />
    )
    expect(container).toMatchSnapshot()
})
