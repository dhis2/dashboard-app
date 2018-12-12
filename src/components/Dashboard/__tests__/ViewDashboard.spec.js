import React from 'react';
import { shallow } from 'enzyme';
import { ViewDashboard } from '../ViewDashboard';
import { DashboardContent } from '../DashboardContent';
import { NoContentMessage } from '../../../widgets/NoContentMessage';

describe('ViewDashboard', () => {
    let props;
    let shallowViewDashboard;
    const viewDashboard = () => {
        if (!shallowViewDashboard) {
            shallowViewDashboard = shallow(<ViewDashboard {...props} />);
        }
        return shallowViewDashboard;
    };

    const assertDashboardContent = () => {
        const children = viewDashboard()
            .find('.dashboard-wrapper')
            .children();

        expect(children.length).toBe(1);
        expect(children.dive().find(NoContentMessage)).toHaveLength(0);
        expect(children.dive().find(DashboardContent)).toHaveLength(1);
    };

    const assertNoContentMessage = () => {
        const children = viewDashboard()
            .find('.dashboard-wrapper')
            .children();

        expect(children.length).toBe(1);
        expect(children.dive().find(NoContentMessage)).toHaveLength(1);
        expect(children.dive().find(DashboardContent)).toHaveLength(0);
    };

    beforeEach(() => {
        props = {
            id: undefined,
            dashboardsIsEmpty: undefined,
            dashboardsLoaded: undefined,
        };
        shallowViewDashboard = undefined;
    });

    describe('when "dashboardsLoaded" is false', () => {
        it('does not render any children inside the div', () => {
            props.dashboardsLoaded = false;

            expect(
                viewDashboard()
                    .find('.dashboard-wrapper')
                    .children().length
            ).toBe(0);
        });
    });

    describe('when "dashboardsLoaded" is true', () => {
        beforeEach(() => {
            props.dashboardsLoaded = true;
        });

        describe('when "id" is null', () => {
            it('does not render any children inside the div', () => {
                props.id = null;
                expect(
                    viewDashboard()
                        .find('.dashboard-wrapper')
                        .children().length
                ).toBe(0);
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

            describe('when id is not null or false', () => {
                beforeEach(() => {
                    props.id = '123xyz';
                });

                it('renders DashboardContent', () => {
                    assertDashboardContent();
                });
            });

            describe('when id is false', () => {
                beforeEach(() => {
                    props.id = false;
                });

                it('renders a NoContentMessage', () => {
                    assertNoContentMessage();
                });
            });
        });
    });
});
