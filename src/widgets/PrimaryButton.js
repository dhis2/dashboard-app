import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import './PrimaryButton.css';

const PrimaryButton = props => {
    const { onClick, children, disabled, style } = props;
    const label = typeof children === 'string' ? children : null;
    const classes = ['d2ui-primary-button', disabled ? 'disabled' : null].join(
        ' '
    );

    return (
        <RaisedButton
            className={classes}
            style={style}
            primary={true}
            onClick={onClick}
            label={label}
            disabled={disabled}
        />
    );
};

export default PrimaryButton;
