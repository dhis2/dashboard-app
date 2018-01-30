import React, { Component } from 'react';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

class Info extends Component {
    show = false;

    toggle() {
        this.show = !this.show;
        return this.show;
    }

    render() {
        return (
            <div onClick={() => this.props.onClick(this.toggle())}>
                <SvgIcon icon={'InfoOutline'} />
            </div>
        );
    }
}

export default Info;
