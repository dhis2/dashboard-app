import React, { Component, Fragment } from 'react';
import Interpretations from './Interpretations/Interpretations';
import { colors } from '../../colors';
import { getId, getDescription } from './plugin';

const style = {
    scrollContainer: {
        overflowY: 'scroll',
        height: '380px',
        paddintTop: '5px',
    },
    containerHidden: {
        paddingTop: 0,
    },
    line: {
        margin: '-1px 0px 0px',
        height: '1px',
        border: 'none',
        backgroundColor: colors.lightGrey,
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
                {this.props.showInterpretations ? (
                    <Fragment>
                        <hr style={style.line} />
                        <div style={style.scrollContainer}>
                            <ItemDescription description={description} />
                            <hr style={style.line} />
                            <Interpretations
                                objectType={this.props.item.type}
                                objectId={objectId}
                            />
                        </div>
                    </Fragment>
                ) : null}
            </div>
        );
    }
}

export default ItemFooter;
