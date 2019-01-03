import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add-circle';
import { colors } from '../modules/colors';

const styles = {
    button: {
        width: 36,
        height: 36,
        padding: 0,
    },
    iconStyle: {
        width: 32,
        height: 32,
    },
    icon: IconAdd,
    iconColor: colors.mediumGreen,
};

const D2IconButton = props => (
    <IconButton
        style={styles.button}
        iconStyle={Object.assign({}, styles.iconStyle, props.iconStyle)}
        onClick={props.onClick}
    >
        {props.icon || <IconAdd color={styles.iconColor} />}
    </IconButton>
);

D2IconButton.propTypes = {
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    icon: PropTypes.object,
    iconColor: PropTypes.string,
    onClick: PropTypes.func,
};

D2IconButton.defaultProps = {
    style: null,
    iconStyle: null,
    icon: null,
    iconColor: '',
    onClick: Function.prototype,
};

export default D2IconButton;
