import React, { Component } from 'react';

import { colors } from '../../../modules/colors';
import { getId, getDescription } from './plugin';
import Interpretations from './Interpretations/Interpretations';

const style = {
    scrollContainer: {
        overflowY: 'auto',
        height: '370px',
        marginTop: '5px',
        marginBottom: '5px',
        paddingLeft: '14px',
    },
    line: {
        margin: '-1px 0px 0px',
        height: '1px',
        border: 'none',
        backgroundColor: colors.lightGrey,
    },
    descriptionContainer: {
        padding: '5px',
    },
    descriptionTitle: {
        color: colors.black,
        fontSize: '13px',
        fontWeight: 'bold',
        height: '19px',
        lineHeight: '19px',
    },
    descriptionText: {
        fontSize: '13px',
        lineHeight: '17px',
    },
};

const ItemDescription = ({ description }) => {
    return (
        <div style={style.descriptionContainer}>
            <h3 style={style.descriptionTitle}>Description</h3>
            <p style={style.descriptionText}>{description}</p>
        </div>
    );
};

class ItemFooter extends Component {
    render() {
        const objectId = getId(this.props.item);
        const description = getDescription(this.props.item);

        return (
            <div className="dashboard-item-footer">
                <hr style={style.line} />
                <div style={style.scrollContainer}>
                    <ItemDescription description={description} />
                    <hr style={style.line} />
                    <Interpretations
                        object={this.props.item}
                        objectId={objectId}
                    />
                </div>
            </div>
        );
    }
}

export default ItemFooter;
