import React, { Component } from 'react';
import Interpretations from './Interpretations/Interpretations';
import { colors } from '../../colors';

import { getDescription } from './plugin';
import { orArray, REPORT_TABLE, CHART } from '../../util';

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
    description: {
        color: colors.black,
        fontSize: '13px',
        fontWeight: 'bold',
        height: '19px',
        lineHeight: '19px',
    },
};

const extractInterpretations = item => {
    switch (item.type) {
        case REPORT_TABLE:
            return item.reportTable.interpretations;
        case CHART:
            return item.chart.interpretations;
        default:
            return [];
    }
};

const extractObjectId = item => {
    switch (item.type) {
        case REPORT_TABLE:
            return item.reportTable.id;
        case CHART:
            return item.chart.id;
        default:
            return [];
    }
};

class ItemFooter extends Component {
    render() {
        const objectId = extractObjectId(this.props.item);
        const ids = [];
        const interpretations = orArray(
            extractInterpretations(this.props.item)
        );
        interpretations.forEach(element => {
            ids.push(element.id);
        });

        return (
            <div className="dashboard-item-footer" style={style.container}>
                {this.props.showDescription ? (
                    <div>
                        <hr style={style.line} />
                        <h3 style={style.description}>Description</h3>
                        <p>{getDescription(this.props.item)}</p>
                    </div>
                ) : null}
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
