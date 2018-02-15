import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { colors } from '../colors';

const style = {
    color: colors.royalBlue,
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    cursor: 'pointer',
};

const PlainButton = ({ onClick, children }) => {
    const label = typeof children === 'string' ? children : null;

    return (
        <FlatButton
            style={style}
            onClick={onClick}
            label={label}
            disabledBackgroundColor={colors.white}
            disabledLabelColor={colors.lightMediumGrey}
        />
    );
};

export default PlainButton;
