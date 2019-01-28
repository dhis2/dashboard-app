import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { ShowMoreButton } from '../ShowMoreButton';

describe('ShowMoreButton', () => {
    it('renders correctly when at maxHeight', () => {
        const tree = renderer
            .create(
                <ShowMoreButton
                    onClick={() => {}}
                    isMaxHeight={true}
                    classes={{ showMore: {} }}
                />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly when not at maxHeight', () => {
        const tree = renderer
            .create(
                <ShowMoreButton
                    onClick={() => {}}
                    isMaxHeight={false}
                    classes={{ showMore: {} }}
                />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    describe('actions', () => {
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
                classes: { showMore: {} },
            };
            shallowShowMoreButton = undefined;
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
});
