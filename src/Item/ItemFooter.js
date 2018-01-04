import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Interpretations from './Interpretations/Interpretations';

const extractInterpretations = item => {
    switch (item.type) {
        case 'CHART':
            return item.chart.interpretations;
        case 'REPORT_TABLE':
            return item.reportTable.interpretations;
        default:
            return [];
    }
};

const extractObjectId = item => {
    switch (item.type) {
        case 'CHART':
            return item.chart.id;
        case 'REPORT_TABLE':
            return item.reportTable.id;
        default:
            return [];
    }
};

class ItemFooter extends Component {
    render() {
        const ids = [];
        const interpretations = extractInterpretations(this.props.item);
        const objectId = extractObjectId(this.props.item);
        interpretations.forEach(element => {
            ids.push(element.id);
        });

        return (
            <Dialog
                modal={false}
                open={this.props.show}
                autoScrollBodyContent={true}
                onRequestClose={this.props.onToggleInterpretations}
            >
                <Interpretations
                    objectType={this.props.item.type}
                    objectId={objectId}
                    ids={ids}
                />
            </Dialog>
        );
    }
}

export default ItemFooter;
