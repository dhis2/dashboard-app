import React from 'react';
import { shallow } from 'enzyme';
import InputField from '@material-ui/core/Input';
import { Filter, KEYCODE_ENTER, KEYCODE_ESCAPE } from '../Filter';

describe('Filter', () => {
    let props;
    let shallowFilter;
    const name = 'rainbow';
    const filter = () => {
        if (!shallowFilter) {
            shallowFilter = shallow(<Filter {...props} />);
        }
        return shallowFilter;
    };

    beforeEach(() => {
        props = {
            name,
            onChangeName: jest.fn(),
            classes: {},
        };
        shallowFilter = undefined;
    });

    it('matches the snapshot when name property is empty', () => {
        expect(filter()).toMatchSnapshot();
    });

    describe('when InputField value is changed', () => {
        beforeEach(() => {
            props.onChangeName = jest.fn();
        });

        it('triggers onChangeName property with correct value', () => {
            const newValue = 'fluttershy';
            const e = {
                target: { value: newValue },
                preventDefault: jest.fn(),
            };
            const inputField = filter().find(InputField);
            inputField.simulate('change', e);
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
            filter()
                .find(InputField)
                .simulate('keyUp', { keyCode: KEYCODE_ENTER });

            expect(props.onKeypressEnter).toHaveBeenCalledTimes(1);
            expect(props.onChangeName).not.toHaveBeenCalled();
        });

        it('triggers onChangeName when key is ESCAPE', () => {
            filter()
                .find(InputField)
                .simulate('keyUp', { keyCode: KEYCODE_ESCAPE });

            expect(props.onChangeName).toHaveBeenCalledTimes(1);
            expect(props.onChangeName).toHaveBeenCalledWith();
            expect(props.onKeypressEnter).not.toHaveBeenCalled();
        });
    });
});
