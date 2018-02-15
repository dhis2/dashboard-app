import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
    textLink: {
        fontSize: '14px',
        fontWeight: 400,
        color: '#000',
        cursor: 'pointer',
    },
    textLinkHover: {
        color: '#666',
    },
};

class D2TextLink extends Component {
    constructor(props) {
        super(props);

        this.onMouseOverHandle = this.onMouseOverHandle.bind(this);
        this.onMouseOutHandle = this.onMouseOutHandle.bind(this);

        const { style } = props;

        this.state = Object.assign({}, styles.textLink, style);
    }

    onMouseOverHandle(event) {
        event.preventDefault();

        const { style, hoverStyle } = this.props;

        this.setState({
            ...styles.textLink,
            ...styles.textLinkHover,
            ...style,
            ...hoverStyle,
        });
    }

    onMouseOutHandle(event) {
        event.preventDefault();

        const { style } = this.props;

        this.setState({
            ...styles.textLink,
            ...style,
        });
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

D2TextLink.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    hoverStyle: PropTypes.object,
};

D2TextLink.defaultProps = {
    text: '',
    onClick: Function.prototype,
    style: null,
    hoverStyle: null,
};

export default D2TextLink;
