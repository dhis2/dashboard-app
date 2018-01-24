import React, { Component, Fragment } from 'react';
import ItemButton from '../ItemButton';
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
                    <ItemButton
                        icon={'Message'}
                        onClick={onInterpretationsClick}
                    />
                </div>
                <div style={{ paddingLeft: 10, marginRight: 4 }}>
                    <ItemButton icon={'ViewList'} onClick={onViewTable} />
                </div>
                <div style={{ marginRight: 4 }}>
                    <ItemButton icon={'InsertChart'} onClick={onViewChart} />
                </div>
                <ItemButton icon={'Public'} onClick={() => {}} />
            </Fragment>
        );
    }
}

export default PluginItemHeaderButtons;
