import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FilterCard from './FilterCard';

class ItemFilter extends React.Component {
    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.props.onRequestClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                disabled={true}
                onClick={this.props.onRequestClose}
            />,
        ];

        return (
            <Dialog
                title="Dashboard filters"
                actions={actions}
                modal={false}
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
            >
                <FilterCard title="Organisation unit" />
            </Dialog>
        );
    }
}

export default ItemFilter;
