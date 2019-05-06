import React from 'react';
import { shallow } from 'enzyme';
import Dialog from 'material-ui/Dialog';
import { Button } from '@dhis2/ui-core';

import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog';
import { getStubContext } from '../../../setupTests';

describe('ConfirmDeleteDialog', () => {
    let props;
    let shallowDialog;
    const dialog = () => {
        if (!shallowDialog) {
            shallowDialog = shallow(<ConfirmDeleteDialog {...props} />, {
                context: getStubContext(),
            });
        }
        return shallowDialog;
    };

    beforeEach(() => {
        props = {
            dashboardName: '',
            onDeleteConfirmed: jest.fn(),
            onContinueEditing: jest.fn(),
            open: false,
        };
        shallowDialog = undefined;
    });

    it('renders a Dialog', () => {
        expect(dialog().find(Dialog).length).toBeGreaterThan(0);
    });

    it('renders two buttons', () => {
        expect(dialog().prop('actions')).toHaveLength(2);
    });

    it.only('renders a Primary button with action onContinueEditing', () => {
        // expect.assertions(1);
        dialog()
            .prop('actions')
            .forEach(button => {
                console.log('button', button);

                if (button.type === 'span') {
                    console.log('its a span');
                    // console.log(button.find(Button).props);

                    // expect(button.dive().find(Button).props.onClick).toBe(
                    //     props.onContinueEditing
                    // );
                }
            });
    });

    it('renders a Secondary button with action onDeleteConfirmed', () => {
        expect.assertions(1);
        dialog()
            .prop('actions')
            .forEach(button => {
                if (button.type === Button) {
                    expect(button.props.onClick).toBe(props.onDeleteConfirmed);
                }
            });
    });
});
