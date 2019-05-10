import React from 'react';
import { shallow } from 'enzyme';
import { ClearButton } from '../ClearButton';

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
            onChange: jest.fn(),
        };
        shallowClearButton = undefined;
    });

    it('renders a button', () => {
        expect(clearButton().find('button').length).toBeGreaterThan(0);
    });

    it('triggers onChange when clicked', () => {
        clearButton()
            .find('button')
            .simulate('click');
        expect(props.onChange).toHaveBeenCalled();
    });
});
