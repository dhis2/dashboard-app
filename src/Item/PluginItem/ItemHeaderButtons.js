import React, { Component, Fragment } from 'react';
import ItemHeaderButton from '../ItemHeaderButton';
import {
    VISUALIZATION_TYPE_TABLE,
    VISUALIZATION_TYPE_CHART,
    // VISUALIZATION_TYPE_MAP,
    itemTypeMap,
} from '../../itemTypes';

export const getItemTypeId = (itemTypeMap, visualizationType, domainType) =>
    Object.values(itemTypeMap)
        .filter(
            item =>
                item.visualizationType === visualizationType &&
                item.domainType === domainType
        )
        .map(item => item.id);

class PluginItemHeaderButtons extends Component {
    render() {
        const {
            item,
            onSelectVisualization,
            onInterpretationsClick,
        } = this.props;

        const domainType = itemTypeMap[item.type].domainType;

        const onViewTable = () =>
            onSelectVisualization(
                getItemTypeId(itemTypeMap, VISUALIZATION_TYPE_TABLE, domainType)
            );

        const onViewChart = () =>
            onSelectVisualization(
                getItemTypeId(itemTypeMap, VISUALIZATION_TYPE_CHART, domainType)
            );

        // const onViewMap = () =>
        //     onSelectVisualization(
        //         getItemTypeId(
        //             itemTypeMap,
        //             VISUALIZATION_TYPE_MAP,
        //             domainType
        //         )
        //     );

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
