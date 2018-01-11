import React, { Component } from 'react';
import Interpretations from './Interpretations/Interpretations';
import { colors } from '../styleGuide';

const style = {
    container: {
        padding: '5px',
    },
    line: {
        margin: '-1px 0px 0px',
        height: '1px',
        border: 'none',
        backgroundColor: colors.lightGrey,
    },
};

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
        const objectId = extractObjectId(this.props.item);
        const ids = [];
        const interpretations = extractInterpretations(this.props.item);
        interpretations.forEach(element => {
            ids.push(element.id);
        });

        return (
            <div style={style.container}>
                {this.props.showInterpretations ? (
                    <div>
                        <hr style={style.line} />
                        <Interpretations
                            objectType={this.props.item.type}
                            objectId={objectId}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

export default ItemFooter;
