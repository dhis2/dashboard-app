import React from 'react';
import ItemHeaderButton from '../ItemHeaderButton';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const tree = renderer
        .create(
            <ItemHeaderButton
                onClick={() => console.log('Rainbow Dash')}
                style={{ fill: 'purple' }}
            >
                My Little Pony
            </ItemHeaderButton>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
