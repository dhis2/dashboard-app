import React from 'react';
import { shallow } from 'enzyme';
import ItemHeaderButtons from '../ItemHeaderButtons';

it('renders correctly', () => {
    const buttons = shallow(<ItemHeaderButtons
        item={{
            type: 'CHART',
            chart: { type: 'NOT_YOY', domainType: 'AGGREGATE' },
        }}
        onSelectVisualization={Function.prototype}
        activeFooter={false}
        activeType={'CHART'}
        onToggleFooter={Function.prototype}
    >
        My Little Pony
    </ItemHeaderButtons>);
    expect(buttons).toMatchSnapshot();
});
