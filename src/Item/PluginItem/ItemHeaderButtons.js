import React, { Component, Fragment } from 'react';
import ItemHeaderButton from '../ItemHeaderButton';
import {
    VISUALIZATION_TYPE_TABLE,
    VISUALIZATION_TYPE_CHART,
    // VISUALIZATION_TYPE_MAP,
    itemTypeMap,
    CHART,
    MAP,
    REPORT_TABLE,
} from '../../itemTypes';

import { colors } from '../../colors';

const style = {
    iconBase: {
        width: '22px',
        height: '22px',
        fill: colors.lightMediumGrey,
    },
    buttonBase: {
        padding: '6px 6px 4px 6px',
    },
    border: {
        borderRadius: '2px',
        border: `1px solid ${colors.lightGrey}`,
    },
};

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
            activeVisualization,
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

        const baseStyle = Object.assign(
            {},
            { icon: style.iconBase },
            { container: style.buttonBase }
        );

        const activeStyle = Object.assign(
            {},
            { icon: { ...style.iconBase, fill: colors.royalBlue } },
            {
                container: {
                    ...style.buttonBase,
                    backgroundColor: colors.lightBlue,
                },
            }
        );

        const visContainerStyle = Object.assign({}, style.border);
        const chartButtonStyle =
            activeVisualization === CHART ? activeStyle : baseStyle;
        const tableButtonStyle =
            activeVisualization === REPORT_TABLE ? activeStyle : baseStyle;
        const mapButtonStyle =
            activeVisualization === MAP ? activeStyle : baseStyle;

        const toggleFooterStyle = activeFooter ? activeStyle : baseStyle;

        const finaltoggleFooterStyle = Object.assign({}, toggleFooterStyle, {
            container: { ...toggleFooterStyle.container, ...style.border },
        });

        return (
            <Fragment>
                <div style={{ marginRight: 10 }}>
                    <ItemHeaderButton
                        style={finaltoggleFooterStyle}
                        icon={'Message'}
                        onClick={onToggleFooter}
                    />
                </div>
                <div style={visContainerStyle}>
                    <ItemHeaderButton
                        style={tableButtonStyle}
                        icon={'ViewList'}
                        onClick={onViewTable}
                    />
                    <ItemHeaderButton
                        style={chartButtonStyle}
                        icon={'InsertChart'}
                        onClick={onViewChart}
                    />
                    <ItemHeaderButton
                        style={mapButtonStyle}
                        icon={'Public'}
                        onClick={() => {}}
                    />
                </div>
            </Fragment>
        );
    }
}

export default PluginItemHeaderButtons;
