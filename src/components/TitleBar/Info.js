import React, { Component } from 'react';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import { colors } from '../../modules/colors';

class Info extends Component {
    show = false;

    toggle() {
        this.show = !this.show;
        return this.show;
    }

    render() {
        return (
            <div onClick={() => this.props.onClick(this.toggle())}>
                <InfoOutlineIcon style={{ fill: colors.muiDefaultGrey }} />
            </div>
        );
    }
}

export default Info;
