import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
    textlink: {
        fontSize: '14px',
        fontWeight: 400,
        color: '#000',

        cursor: 'pointer',
    },
    textlinkHover: {
        color: '#666',
    },
};

export default class Textlink extends Component {
    constructor(props) {
        super(props);

        this.onMouseOverHandle = this.onMouseOverHandle.bind(this);
        this.onMouseOutHandle = this.onMouseOutHandle.bind(this);

        const { style } = props;

        this.state = Object.assign({}, styles.textlink, style);
    }

    onMouseOverHandle() {
        const { style, hoverStyle } = this.props;

        this.setState(Object.assign({}, styles.textlink, styles.textlinkHover, style, hoverStyle));
    }

    onMouseOutHandle() {
        const { style } = this.props;

        this.setState(Object.assign({}, styles.textlink, style));
    }

    render() {
        const { text, onClick } = this.props;

        return (
            <span
                style={this.state}
                onClick={onClick}
                onMouseOver={this.onMouseOverHandle}
                onMouseOut={this.onMouseOutHandle}
            >
                {text}
            </span>
        );
    }
}

Textlink.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    hoverStyle: PropTypes.object,
};

Textlink.defaultProps = {
    text: '',
    onClick: Function.prototype,
    style: null,
    hoverStyle: null,
};
