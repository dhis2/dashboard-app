import React from 'react'
import PropTypes from 'prop-types'
import ContentEditable from 'react-contenteditable'
import isFunction from 'd2-utilizr/lib/isFunction'

import './D2ContentEditable.css'

const KEYCODE_ENTER = 13

class D2ContentEditable extends React.Component {
    handleKeyDown = (event, onBlur) => {
        if (event.keyCode === KEYCODE_ENTER) {
            event.preventDefault()
            this.component.htmlEl.blur()

            isFunction(onBlur) && onBlur(this.component.htmlEl.textContent)
        }
    }

    render() {
        const {
            className,
            text,
            disabled,
            placeholder,
            onBlur,
            onChange
        } = this.props
        return (
            // Provide both 'disabled' and 'disable' due to typo in shouldComponentUpdate
            <ContentEditable
                ref={c => (this.component = c)}
                className={className}
                html={text}
                onKeyDown={e => this.handleKeyDown(e, onBlur)}
                disabled={disabled}
                disable={'' + disabled}
                data-text={placeholder}
                onChange={onChange}
            />
        )
    }
}

D2ContentEditable.propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
}

D2ContentEditable.defaultProps = {
    className: '',
    text: '',
    onBlur: null,
    disabled: false,
    placeholder: ''
}

export default D2ContentEditable
