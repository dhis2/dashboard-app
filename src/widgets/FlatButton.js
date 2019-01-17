import React from 'react';
import MuiFlatButton from 'material-ui/FlatButton';
import { colors } from '../modules/colors';

const defaultStyles = {
    color: colors.royalBlue,
    backgroundColor: 'transparent',
    minWidth: '30px',
};

const FlatButton = ({ onClick, children, style, disabled }) => {
    const label = typeof children === 'string' ? children : null;
    const classes = ['d2ui-flat-button', disabled ? 'disabled' : null].join(
        ' '
    );

    const combinedStyle = Object.assign({}, defaultStyles, style);

    return (
        <MuiFlatButton
            className={classes}
            style={combinedStyle}
            onClick={onClick}
            label={label}
            disabled={disabled}
        >
            {typeof children !== 'string' ? children : null}
        </MuiFlatButton>
    );
};

export default FlatButton;
