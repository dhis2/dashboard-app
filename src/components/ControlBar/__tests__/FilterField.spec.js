import React from 'react';
import { shallow } from 'enzyme';
import TextField from 'material-ui/TextField';

import { Filter, KEYCODE_ENTER, KEYCODE_ESCAPE } from '../Filter';

describe('Filter Field', () => {
    let props;
    let shallowFilterField;
    const filterField = () => {
        if (!shallowFilterField) {
            shallowFilterField = shallow(<Filter {...props} />);
        }
        return shallowFilterField;
    };

    beforeEach(() => {
        props = {
            name: undefined,
            onChangeName: undefined,
        };
        shallowFilterField = undefined;
    });

    it('always renders a TextField', () => {
        const textField = filterField().find(TextField);
        expect(textField.length).toBeGreaterThan(0);
    });

    describe('when updated name property is provided', () => {
        beforeEach(() => {
            props.onChangeName = jest.fn();
        });

        it('renders a TextField with correct value property', () => {
            const filter = filterField();
            filter.setProps({ name: 'rainbow' });

            expect(filter.find(TextField).props().value).toEqual('rainbow');
            expect(props.onChangeName).not.toHaveBeenCalled();
        });
    });

    describe('when textField value is changed', () => {
        beforeEach(() => {
            props.onChangeName = jest.fn();
        });

        it('triggers onChangeName property with correct value', () => {
            const newValue = 'fluttershy';
            const e = {
                target: { value: newValue },
                preventDefault: jest.fn(),
            };
            const textField = filterField().find(TextField);
            textField.simulate('change', e);
            expect(e.preventDefault).toHaveBeenCalledTimes(1);
            expect(props.onChangeName).toHaveBeenCalledTimes(1);
            expect(props.onChangeName).toHaveBeenCalledWith(newValue);
        });
    });

    describe('when key is pressed', () => {
        beforeEach(() => {
            props.onKeypressEnter = jest.fn();
            props.onChangeName = jest.fn();
        });

        it('triggers onKeypressEnter when key is ENTER', () => {
            filterField()
                .find(TextField)
                .simulate('keyUp', { keyCode: KEYCODE_ENTER });

            expect(props.onKeypressEnter).toHaveBeenCalledTimes(1);
            expect(props.onChangeName).not.toHaveBeenCalled();
        });

        it('triggers onChangeName when key is ESCAPE', () => {
            filterField()
                .find(TextField)
                .simulate('keyUp', { keyCode: KEYCODE_ESCAPE });

            expect(props.onChangeName).toHaveBeenCalledTimes(1);
            expect(props.onChangeName).toHaveBeenCalledWith();
            expect(props.onKeypressEnter).not.toHaveBeenCalled();
        });
    });
});
