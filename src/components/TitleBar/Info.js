import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';

const styles = theme => ({
    icon: {
        fill: theme.palette.shadow,
    },
});

class Info extends Component {
    show = false;

    toggle() {
        this.show = !this.show;
        return this.show;
    }

    render() {
        return (
            <div onClick={() => this.props.onClick(this.toggle())}>
                <InfoOutlineIcon className={this.props.classes.icon} />
            </div>
        );
    }
}

export default withStyles(styles)(Info);
