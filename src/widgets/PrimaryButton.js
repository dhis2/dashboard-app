import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { colors } from '../colors';

import './PrimaryButton.css';

const style = {
    borderRadius: '2px',
    // backgroundColor: colors.royalBlue,
    color: colors.white,
    fontWeight: '500',
    boxShadow:
        '0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.24), 0 0 8px 0 rgba(0,0,0,0.12), 0 0 8px 0 rgba(0,0,0,0.24)',
};

const PrimaryButton = props => {
    const { onClick, children } = props;
    const label = typeof children === 'string' ? children : null;
    return (
        <RaisedButton
            className="d2ui-primary-button"
            style={style}
            primary={true}
            onClick={onClick}
            label={label}
            disabled={true}
        />
    );
};

export default PrimaryButton;
