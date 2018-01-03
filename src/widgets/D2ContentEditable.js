import React from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';

import './D2ContentEditable.css';

const KEYCODE_ENTER = 13;

const handleKeyDown = e => {
    if (e.keyCode === KEYCODE_ENTER) {
        e.preventDefault();
        this.component.htmlEl.blur();
    }
};

const D2ContentEditable = props => (
    // Provide both 'disabled' and 'disable' due to typo in shouldComponentUpdate
    <ContentEditable
        className={props.className}
        html={props.name}
        onKeyDown={handleKeyDown}
        onBlur={props.onBlur}
        disabled={props.disabled}
        disable={'' + props.disabled}
        data-text={props.placeholder}
    />
);

D2ContentEditable.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
};

D2ContentEditable.defaultProps = {
    className: '',
    name: '',
    onBlur: null,
    disabled: false,
    placeholder: '',
};

export default D2ContentEditable;
