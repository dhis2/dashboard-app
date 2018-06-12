import React from 'react';
import { shallow } from 'enzyme';
import { ViewDashboardContent } from '../ViewDashboardContent';
import TitleBar from '../../TitleBar/TitleBar';
import ItemGrid from '../../ItemGrid/ItemGrid';
import { NoContentMessage } from '../../widgets/NoContentMessage';

describe('ViewDashboardContent', () => {
    let props;
    let shallowViewDashboardContent;
    const viewDashboardContent = () => {
        if (!shallowViewDashboardContent) {
            shallowViewDashboardContent = shallow(
                <ViewDashboardContent {...props} />
            );
        }
        return shallowViewDashboardContent;
    };

    const assertTitleAndGrid = () => {
        const children = viewDashboardContent().children();

        expect(children.length).toBe(1);
        expect(children.dive().find(NoContentMessage)).toHaveLength(0);
        expect(children.dive().find(TitleBar)).toHaveLength(1);
        expect(children.dive().find(ItemGrid)).toHaveLength(1);
    };

    const assertNoContentMessage = () => {
        const children = viewDashboardContent().children();

        expect(children.length).toBe(1);
        expect(children.dive().find(NoContentMessage)).toHaveLength(1);
        expect(children.dive().find(ItemGrid)).toHaveLength(0);
    };

    beforeEach(() => {
        props = {
            selectedId: undefined,
            dashboardsIsEmpty: undefined,
            dashboardsLoaded: undefined,
        };
        shallowViewDashboardContent = undefined;
    });

    it('renders a div', () => {
        expect(viewDashboardContent().find('div').length).toBeGreaterThan(0);
    });

    describe('when "dashboardsLoaded" is false', () => {
        it('does not render any children inside the div', () => {
            props.dashboardsLoaded = false;
            expect(viewDashboardContent().children().length).toBe(0);
        });
    });

    describe('when "dashboardsLoaded" is true', () => {
        beforeEach(() => {
            props.dashboardsLoaded = true;
        });

        describe('when "selectedId" is null', () => {
            it('does not render any children inside the div', () => {
                props.selectedId = null;
                expect(viewDashboardContent().children().length).toBe(0);
            });
        });

        describe('when "dashboardsIsEmpty" is true', () => {
            beforeEach(() => {
                props.dashboardsIsEmpty = true;
            });

            it('renders a NoContentMessage', () => {
                assertNoContentMessage();
            });
        });

        describe('when "dashboardsIsEmpty" is false', () => {
            beforeEach(() => {
                props.dashboardsIsEmpty = false;
            });

            describe('when selectedId is not null or false', () => {
                beforeEach(() => {
                    props.selectedId = '123xyz';
                });

                it('renders a TitleBar and ItemGrid', () => {
                    assertTitleAndGrid();
                });
            });

            describe('when selectedId is false', () => {
                beforeEach(() => {
                    props.selectedId = false;
                });

                it('renders a NoContentMessage', () => {
                    assertNoContentMessage();
                });
            });
        });
    });
});
