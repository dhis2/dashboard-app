import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { colors } from '../colors';

const defaultStyles = {
    color: colors.royalBlue,
    backgroundColor: 'transparent',
};

const PlainButton = ({ onClick, children, style, disabled }) => {
    const label = typeof children === 'string' ? children : null;
    const classes = ['d2ui-flat-button', disabled ? 'disabled' : null].join(
        ' '
    );

    const combinedStyle = Object.assign({}, defaultStyles, style);

    return (
        <FlatButton
            className={classes}
            style={combinedStyle}
            onClick={onClick}
            label={label}
            disabled={disabled}
        />
    );
};

export default PlainButton;
