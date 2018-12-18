import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
    defaultFontStyle: {
        color: '#222',
        fontSize: '14px',
    },
    labelStyle: {
        position: 'relative',
        top: '-2px',
    },
    listStyle: {
        padding: '10px 0 !important',
    },
    iconStyle: {
        top: '2px',
    },
    selectedMenuItemStyle: {
        fontWeight: 500,
    },
    underlineStyle: {
        border: '0 none',
    },
    style: {
        height: '52px',
    },
};

class D2Dropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
        });
    }

    handleChange(event, index, value) {
        if (value !== this.state.value) {
            this.setState({ value });

            this.props.onClick(value, this.props);
        }
    }

    render() {
        const data = this.props.data;

        return (
            <DropDownMenu
                value={this.state.value}
                onChange={this.handleChange}
                labelStyle={Object.assign(
                    {},
                    styles.defaultFontStyle,
                    styles.labelStyle
                )}
                listStyle={Object.assign(
                    {},
                    styles.defaultFontStyle,
                    styles.listStyle
                )}
                iconStyle={styles.iconStyle}
                selectedMenuItemStyle={Object.assign(
                    {},
                    styles.defaultFontStyle,
                    styles.selectedMenuItemStyle
                )}
                style={styles.style}
                underlineStyle={styles.underlineStyle}
            >
                {data.map(d => (
                    <MenuItem key={d.id} value={d.id} primaryText={d.value} />
                ))}
            </DropDownMenu>
        );
    }
}

D2Dropdown.propTypes = {
    value: PropTypes.string,
    onClick: PropTypes.func,
    data: PropTypes.array.isRequired,
};

D2Dropdown.defaultProps = {
    value: '',
    onClick: Function.prototype,
    data: PropTypes.array.isRequired,
};

export default D2Dropdown;
