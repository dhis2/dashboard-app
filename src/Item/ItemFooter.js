import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';

import Interpretations from './Interpretations/Interpretations';

class ItemFooter extends Component {
    render() {
        return (
            <Dialog
                modal={false}
                open={this.props.show}
                onRequestClose={this.props.onToggleInterpretations}
            >
                <Interpretations interpretations={this.props.interpretations} />
            </Dialog>
        );
    }
}

export default ItemFooter;
