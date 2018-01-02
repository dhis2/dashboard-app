import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';

class D2ContentEditable extends Component {
    state = {
        name: this.props.name,
    };

    handleKeyDown = e => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.component.htmlEl.blur();
        }
    };
    render() {
        return (
            <ContentEditable
                ref={c => (this.component = c)}
                html={this.state.name}
                onKeyDown={this.handleKeyDown}
                onBlur={this.props.onBlur}
            />
        );
    }
}

D2ContentEditable.propTypes = {
    name: PropTypes.string,
    onBlur: PropTypes.func,
};

D2ContentEditable.defaultProps = {
    name: '',
};

export default D2ContentEditable;
