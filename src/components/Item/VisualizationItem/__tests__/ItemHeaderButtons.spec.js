import React from 'react';
import ItemHeaderButtons from '../ItemHeaderButtons';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const tree = renderer
        .create(
            <ItemHeaderButtons
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
            </ItemHeaderButtons>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
