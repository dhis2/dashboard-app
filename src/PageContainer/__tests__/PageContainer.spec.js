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
            dashboards: undefined,
            edit: undefined,
            marginTop: 1,
        };
        shallowPageContainer = undefined;
    });

    it('renders a div', () => {
        props.dashboards = ['dashboard1'];
        props.edit = false;
        expect(pageContainer().find('div').length).toBeGreaterThan(0);
    });

    describe('when dashboards is null', () => {
        it('does not render any children inside the div', () => {
            props.dashboards = null;
            expect(pageContainer().children().length).toBe(0);
        });
    });

    describe('when dashboards is an empty array', () => {
        beforeEach(() => {
            props.dashboards = [];
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

    describe('when dashboards is an array with values', () => {
        it('renders a Titlebar and ItemGrid', () => {
            props.dashboards = ['dashboard1'];
            const children = pageContainer().children();

            expect(children.length).toBe(1);
            expect(children.dive().find(NoContentMessage)).toHaveLength(0);
            expect(children.dive().find(TitleBar)).toHaveLength(1);
            expect(children.dive().find(ItemGrid)).toHaveLength(1);
        });
    });
});
