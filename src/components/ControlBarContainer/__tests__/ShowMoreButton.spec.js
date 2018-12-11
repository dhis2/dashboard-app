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
            onClick: undefined,
            isMaxHeight: undefined,
        };
        shallowShowMoreButton = undefined;
    });

    it('always renders a div', () => {
        expect(showMoreButton().find('div').length).toBeGreaterThan(0);
    });

    it('the rendered div contains everything else that gets rendered', () => {
        const wrappingDiv = showMoreButton()
            .find('div')
            .first();

        expect(wrappingDiv.children()).toEqual(showMoreButton().children());
    });

    it('changes text when isMaxHeight is changed', () => {
        props.isMaxHeight = true;
        const button1Text = showMoreButton().text();

        shallowShowMoreButton = undefined;
        props.isMaxHeight = false;
        const button2Text = showMoreButton().text();

        expect(button1Text.length).toBeGreaterThan(0);
        expect(button2Text.length).toBeGreaterThan(0);
        expect(button1Text).not.toEqual(button2Text);
    });

    describe('when onClick is defined', () => {
        beforeEach(() => {
            props.onClick = jest.fn();
        });

        it('triggers onClick when div clicked', () => {
            showMoreButton()
                .childAt(0)
                .simulate('click');
            expect(props.onClick).toHaveBeenCalled();
        });
    });
});
