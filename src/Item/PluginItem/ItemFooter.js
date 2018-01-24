import React, { Component } from 'react';
import Interpretations from './Interpretations/Interpretations';
import { colors } from '../../colors';

import { extractFavoriteFromDashboardItem } from '../../util';

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

class ItemFooter extends Component {
    render() {
        const objectId = extractFavoriteFromDashboardItem(this.props.item).id;

        return (
            <div className="dashboard-item-footer" style={style.container}>
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
