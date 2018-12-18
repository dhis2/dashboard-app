import React from 'react';
import { colors } from '../modules/colors';

const style = {
    backgroundColor: colors.lightGrey,
    border: 'none',
    height: '1px',
    margin: '0px 0px 5px 0px',
};

const Line = props => <hr style={style} />;

export default Line;
