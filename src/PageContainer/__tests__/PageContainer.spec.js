import React from 'react';
import { shallow } from 'enzyme';
import { PageContainer } from '../PageContainer';
// import TitleBar from '../../TitleBar/TitleBar';
// import ItemGrid from '../../ItemGrid';

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

    it('renders a PageContainer', () => {
        props.dashboards = ['dashboard1'];
        props.edit = false;
        expect(pageContainer().find('div').length).toBeGreaterThan(0);
    });
});
