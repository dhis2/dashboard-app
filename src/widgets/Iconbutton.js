import React from 'react';
import PropTypes from 'prop-types';

import { blue500 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add-circle';

const styles = {
    style: {
        width: 52,
        height: 52,
        padding: 0,
    },
    iconStyle: {
        width: 28,
        height: 28,
    },
    icon: IconAdd,
    iconColor: blue500,
};

const Iconbutton = props => (
    <IconButton
        style={Object.assign({}, styles.style, props.style)}
        iconStyle={Object.assign({}, styles.iconStyle, props.iconStyle)}
        onClick={props.onClick}
    >
        {props.icon || <IconAdd color={props.iconColor || styles.iconColor} />}
    </IconButton>
);

Iconbutton.propTypes = {
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    icon: PropTypes.object,
    iconColor: PropTypes.object,
    onClick: PropTypes.func,
};

export default Iconbutton;