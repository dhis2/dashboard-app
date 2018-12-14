import React from 'react';
import { shallow } from 'enzyme';
import { ViewDashboard, Content } from '../ViewDashboard';
import { NoContentMessage } from '../../../widgets/NoContentMessage';

jest.mock('../DashboardContent', () => () => (
    <div id="mockDashboardContent">mockDashboardContent</div>
));

describe('ViewDashboard', () => {
    let props;
    let shallowViewDashboard;
    const viewDashboard = () => {
        if (!shallowViewDashboard) {
            shallowViewDashboard = shallow(<ViewDashboard {...props} />);
        }
        return shallowViewDashboard;
    };

    const assertContent = hasContent => {
        const content = viewDashboard().find(Content);

        expect(content.length).toBe(1);
        expect(content.dive().find(NoContentMessage)).toHaveLength(
            hasContent ? 0 : 1
        );
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
                assertContent(false);
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
                    assertContent(true);
                });
            });

            describe('when id is false', () => {
                beforeEach(() => {
                    props.id = false;
                });

                it('renders a NoContentMessage', () => {
                    assertContent(false);
                });
            });
        });
    });
});
