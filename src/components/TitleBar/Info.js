import React, { Component } from 'react';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';

class Info extends Component {
    show = false;

    toggle() {
        this.show = !this.show;
        return this.show;
    }

    render() {
        return (
            <div onClick={() => this.props.onClick(this.toggle())}>
                <InfoOutlineIcon style={{ fill: '#757575' }} />
            </div>
        );
    }
}

export default Info;
