import React from 'react';
import { shallow } from 'enzyme';
import { ButtonStrip } from '@dhis2/ui';
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

    it('matches the snapshot when open = false', () => {
        expect(dialog()).toMatchSnapshot();
    });

    describe('when open = true', () => {
        beforeEach(() => {
            props.open = true;
        });

        it('matches the snapshot', () => {
            expect(dialog()).toMatchSnapshot();
        });

        it('renders a Button with action onContinueEditing', () => {
            props.open = true;
            expect.assertions(1);
            dialog()
                .find(ButtonStrip)
                .children()
                .forEach(actionEl => {
                    if (actionEl.key() === 'cancel') {
                        expect(actionEl.prop('onClick')).toBe(
                            props.onContinueEditing
                        );
                    }
                });
        });

        it('renders a Button with action onDeleteConfirmed', () => {
            props.open = true;
            expect.assertions(1);
            dialog()
                .find(ButtonStrip)
                .children()
                .forEach(actionEl => {
                    if (actionEl.key() === 'delete') {
                        expect(actionEl.prop('onClick')).toBe(
                            props.onDeleteConfirmed
                        );
                    }
                });
        });
    });
});
