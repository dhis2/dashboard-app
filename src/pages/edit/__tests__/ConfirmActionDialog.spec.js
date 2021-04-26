/* eslint-disable react/prop-types */
import React from 'react'
import { render } from '@testing-library/react'
import ConfirmActionDialog, {
    ACTION_DELETE,
    ACTION_DISCARD,
} from '../ConfirmActionDialog'

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

test('ConfirmActionDialog renders confirm delete dialog', () => {
    const { container } = render(
        <ConfirmActionDialog
            action={ACTION_DELETE}
            dashboardName="Twilight Sparkle"
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
            action={ACTION_DISCARD}
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
            action={ACTION_DISCARD}
            onConfirm={jest.fn()}
            onCancel={jest.fn()}
            open={false}
        />
    )
    expect(container).toMatchSnapshot()
})
