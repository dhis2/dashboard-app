import React from 'react';
import { shallow } from 'enzyme';
import { PageContainer } from '../PageContainer';
import TitleBar from '../../TitleBar/TitleBar';
import ItemGrid from '../../ItemGrid/ItemGrid';
import { NoContentMessage } from '../../widgets/NoContentMessage';

describe('PageContainer', () => {
    let props;
    let shallowPageContainer;
    const pageContainer = () => {
        if (!shallowPageContainer) {
            shallowPageContainer = shallow(<PageContainer {...props} />);
        }
        return shallowPageContainer;
    };

    beforeEach(() => {
        props = {
            edit: undefined,
            dashboardsIsEmpty: undefined,
            dashboardsIsNull: undefined,
        };
        shallowPageContainer = undefined;
    });

    it('renders a div', () => {
        expect(pageContainer().find('div').length).toBeGreaterThan(0);
    });

    describe('when "dashboardsIsNull" is true', () => {
        it('does not render any children inside the div', () => {
            props.dashboardsIsNull = true;
            expect(pageContainer().children().length).toBe(0);
        });
    });

    describe('when "dashboardsIsEmpty" is true', () => {
        beforeEach(() => {
            props.dashboardsIsEmpty = true;
        });

        describe('when not in edit mode', () => {
            it('renders a NoContentMessage', () => {
                props.edit = false;
                const children = pageContainer().children();

                expect(children.length).toBe(1);
                expect(children.dive().find(NoContentMessage)).toHaveLength(1);
                expect(children.dive().find(ItemGrid)).toHaveLength(0);
            });
        });

        describe('when in edit mode', () => {
            it('renders a Titlebar and ItemGrid', () => {
                props.edit = true;
                const children = pageContainer().children();

                expect(children.length).toBe(1);
                expect(children.dive().find(NoContentMessage)).toHaveLength(0);
                expect(children.dive().find(TitleBar)).toHaveLength(1);
                expect(children.dive().find(ItemGrid)).toHaveLength(1);
            });
        });
    });

    describe('when "dashboardsIsEmpty" is false', () => {
        it('renders a Titlebar and ItemGrid', () => {
            props.dashboardsIsEmpty = false;
            const children = pageContainer().children();

            expect(children.length).toBe(1);
            expect(children.dive().find(NoContentMessage)).toHaveLength(0);
            expect(children.dive().find(TitleBar)).toHaveLength(1);
            expect(children.dive().find(ItemGrid)).toHaveLength(1);
        });
    });
});
