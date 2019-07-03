import React from 'react';
import { colors } from '@dhis2/ui-core';

const style = {
    backgroundColor: colors.grey200,
    border: 'none',
    height: '1px',
    margin: '0px 0px 5px 0px',
};

const Line = props => <hr style={style} />;

export default Line;
