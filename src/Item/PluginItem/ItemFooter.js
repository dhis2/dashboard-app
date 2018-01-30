import React, { Component } from 'react';
import Interpretations from './Interpretations/Interpretations';
import { colors } from '../../colors';
import { extractFavorite } from './plugin';

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
};

class ItemFooter extends Component {
    render() {
        const objectId = extractFavorite(this.props.item).id;
        const show = this.props.showInterpretations;

        return (
            <div
                className="dashboard-item-footer"
                style={Object.assign(
                    {},
                    style.container,
                    !show ? style.containerHidden : null
                )}
            >
                {show ? (
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
