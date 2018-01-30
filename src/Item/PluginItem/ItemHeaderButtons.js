import React, { Component, Fragment } from 'react';
import ItemHeaderButton from '../ItemHeaderButton';
import {
    VISUALIZATION_TYPE_TABLE,
    VISUALIZATION_TYPE_CHART,
    // VISUALIZATION_TYPE_MAP,
    itemTypeMap,
} from '../../itemTypes';

import { colors } from '../../colors';

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
            activeFooter,
            onToggleFooter,
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

        const buttonContainer = {
            padding: '6px 6px 4px 6px',
            borderRadius: '2px',
            border: `1px solid ${colors.lightGrey}`,
        };
        const container = activeFooter
            ? Object.assign(
                  {},
                  {
                      backgroundColor: colors.lightBlue,
                  },
                  buttonContainer
              )
            : buttonContainer;
        const icon = activeFooter
            ? { fill: colors.royalBlue, width: '22px', height: '22px' }
            : { fill: colors.lightMediumGrey, width: '22px', height: '22px' };

        const toggleFooterStyle = Object.assign({}, { container }, { icon });

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
                        style={toggleFooterStyle}
                        onClick={onToggleFooter}
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
