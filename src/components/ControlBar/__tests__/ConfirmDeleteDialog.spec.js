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

    it('matches the snapshot', () => {
        expect(dialog()).toMatchSnapshot();
    });

    it.skip('renders a Button with action onContinueEditing', () => {
        // expect.assertions(1);
        dialog()
            .prop('actions')
            .forEach(actionEl => {
                const element = shallow(actionEl);

                if (!element.prop('style')) {
                    console.log(
                        'element.childAt(0).props',
                        element.childAt(0).props()
                    );

                    expect(element.find(Button)).toHaveLength(1);

                    // expect(element.childAt(0).prop('onClick')).toBe(
                    //     props.onContinueEditing
                    // );
                }
            });
    });

    it.skip('renders a Button with action onDeleteConfirmed', () => {
        // expect.assertions(1);
        dialog()
            .prop('actions')
            .forEach(actionEl => {
                console.log('here', actionEl.type);

                if (actionEl.type === 'span') {
                    console.log('yes it is a span');

                    const element = shallow(actionEl);
                    console.log('element', element);

                    // expect(actionEl.childAt(0).prop('onClick')).toEqual(
                    //     props.onDeleteConfirmed
                    // );
                }
            });
    });
});
