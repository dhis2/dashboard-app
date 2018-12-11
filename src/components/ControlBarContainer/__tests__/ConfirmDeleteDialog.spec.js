import React from 'react';
import { shallow } from 'enzyme';
import Dialog from 'material-ui/Dialog';

import { ConfirmDeleteDialog } from '../ConfirmDeleteDialog';
import { getStubContext } from '../../../../config/testsContext';
import FlatButton from '../../../widgets/FlatButton';
import PrimaryButton from '../../../widgets/PrimaryButton';

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

    it('renders a Primary button with action onContinueEditing', () => {
        expect.assertions(1);
        dialog()
            .prop('actions')
            .forEach(button => {
                if (button.type === PrimaryButton) {
                    expect(button.props.onClick).toBe(props.onContinueEditing);
                }
            });
    });

    it('renders a Secondary button with action onDeleteConfirmed', () => {
        expect.assertions(1);
        dialog()
            .prop('actions')
            .forEach(button => {
                if (button.type === FlatButton) {
                    expect(button.props.onClick).toBe(props.onDeleteConfirmed);
                }
            });
    });
});
