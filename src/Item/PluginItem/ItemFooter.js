import React, { Component } from 'react';
import Interpretations from './Interpretations/Interpretations';
import { colors } from '../../colors';
import { extractFavorite, getDescription } from './plugin';

const style = {
    container: {
        padding: '5px',
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
    description: {
        color: colors.black,
        fontSize: '13px',
        fontWeight: 'bold',
        height: '19px',
        lineHeight: '19px',
    },
};

class ItemFooter extends Component {
    render() {
        const objectId = extractFavorite(this.props.item).id;

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
