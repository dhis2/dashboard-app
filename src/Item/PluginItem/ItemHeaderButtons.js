import React, { Component, Fragment } from 'react';
import ItemHeaderButton from '../ItemHeaderButton';
import { REPORT_TABLE, CHART } from '../../util';

class PluginItemHeaderButtons extends Component {
    render() {
        const { onSelectVisualization, onInterpretationsClick } = this.props;

        const onViewTable = () => onSelectVisualization(REPORT_TABLE);
        const onViewChart = () => onSelectVisualization(CHART);

        return (
            <Fragment>
                <div
                    style={{
                        paddingRight: 10,
                        borderRight: '1px solid #ddd',
                    }}
                >
                    <ItemHeaderButton
                        icon={'Message'}
                        onClick={onInterpretationsClick}
                    />
                </div>
                <div style={{ paddingLeft: 10, marginRight: 4 }}>
                    <ItemHeaderButton icon={'ViewList'} onClick={onViewTable} />
                </div>
                <div style={{ marginRight: 4 }}>
                    <ItemHeaderButton
                        icon={'InsertChart'}
                        onClick={onViewChart}
                    />
                </div>
                <ItemHeaderButton icon={'Public'} onClick={() => {}} />
            </Fragment>
        );
    }
}

export default PluginItemHeaderButtons;
