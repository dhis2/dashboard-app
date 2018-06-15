import React from 'react';
import { shallow } from 'enzyme';
import Snackbar from 'material-ui/Snackbar';
import { SnackbarMessage } from '../SnackbarMessage';

describe('SnackbarMessage', () => {
    let props;
    let shallowSnackbarMessage;
    const theMessage = 'Luke, I am your father';
    const snackbarMessage = () => {
        if (!shallowSnackbarMessage) {
            shallowSnackbarMessage = shallow(<SnackbarMessage {...props} />);
        }
        return shallowSnackbarMessage;
    };

    beforeEach(() => {
        props = {
            snackbarOpen: false,
            onCloseSnackbar: jest.fn(),
            snackbarMessage: theMessage,
        };
        shallowSnackbarMessage = undefined;
    });

    it('renders a MUI Snackbar', () => {
        expect(snackbarMessage().find(Snackbar)).toHaveLength(1);
    });

    it('renders a closed MUI Snackbar', () => {
        expect(snackbarMessage().prop('open')).toBeFalsy();
    });

    it('renders a MUI Snackbar with given message', () => {
        expect(snackbarMessage().prop('message').props.message).toEqual(
            theMessage
        );
    });
});
