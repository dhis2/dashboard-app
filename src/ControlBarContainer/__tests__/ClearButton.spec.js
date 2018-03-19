import React from 'react';
import { shallow } from 'enzyme';
import IconButton from 'material-ui/IconButton';
import { ClearButton } from '../Filter';

describe('ClearButton', () => {
    let props;
    let shallowClearButton;
    const clearButton = () => {
        if (!shallowClearButton) {
            shallowClearButton = shallow(<ClearButton {...props} />);
        }
        return shallowClearButton;
    };

    beforeEach(() => {
        props = {
            name: '',
            onChangeName: jest.fn(),
        };
        shallowClearButton = undefined;
    });

    it('renders an IconButton', () => {
        expect(clearButton().find(IconButton).length).toBeGreaterThan(0);
    });

    it('renders a disabled button when no name property', () => {
        expect(
            clearButton()
                .find(IconButton)
                .props().disabled
        ).toEqual(true);
    });

    it('renders an enabled button when name property contains non-empty value', () => {
        props.name = 'fluttershy';
        expect(
            clearButton()
                .find(IconButton)
                .props().disabled
        ).toEqual(false);
    });

    it('triggers onChangeName when clicked', () => {
        clearButton()
            .find(IconButton)
            .simulate('click');
        expect(props.onChangeName).toHaveBeenCalled();
    });
});
