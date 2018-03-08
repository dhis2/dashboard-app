import React from 'react';
import { shallow } from 'enzyme';
import ShowMoreButton from '../ShowMoreButton';

describe('ShowMoreButton', () => {
    let props;
    let shallowShowMoreButton;
    const showMoreButton = () => {
        if (!shallowShowMoreButton) {
            shallowShowMoreButton = shallow(<ShowMoreButton {...props} />);
        }
        return shallowShowMoreButton;
    };

    beforeEach(() => {
        props = {
            onToggleMaxHeight: undefined,
            isMaxHeight: undefined,
        };
        shallowShowMoreButton = undefined;
    });

    it('always renders a div', () => {
        const divs = showMoreButton().find('div');
        expect(divs.length).toBeGreaterThan(0);
    });

    it('the rendered div contains everything else that gets rendered', () => {
        const divs = showMoreButton().find('div');
        const wrappingDiv = divs.first();

        expect(wrappingDiv.children()).toEqual(showMoreButton().children());
    });

    it('should change text when isMaxHeight is changed', () => {
        props.isMaxHeight = true;
        const button1Text = showMoreButton().text();

        shallowShowMoreButton = undefined;
        props.isMaxHeight = false;
        const button2Text = showMoreButton().text();

        expect(button1Text.length).toBeGreaterThan(0);
        expect(button2Text.length).toBeGreaterThan(0);
        expect(button1Text).not.toEqual(button2Text);
    });

    describe('when onToggleMaxHeight is defined', () => {
        beforeEach(() => {
            props.onToggleMaxHeight = jest.fn();
        });

        it('should call onToggleMaxHeight when div clicked', () => {
            const innerDiv = showMoreButton().children();

            innerDiv.simulate('click');
            expect(props.onToggleMaxHeight).toHaveBeenCalled();
        });
    });
});
