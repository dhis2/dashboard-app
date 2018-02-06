import React, { Component, Fragment } from 'react';
import arrayContains from 'd2-utilizr/lib/arrayContains';

import ItemHeaderButton from '../ItemHeaderButton';
import {
    VISUALIZATION_TYPE_TABLE,
    VISUALIZATION_TYPE_CHART,
    VISUALIZATION_TYPE_MAP,
    itemTypeMap,
    CHART,
    MAP,
    REPORT_TABLE,
    EVENT_CHART,
    EVENT_REPORT,
} from '../../itemTypes';
import { colors } from '../../colors';

const style = {
    iconBase: {
        width: '24px',
        height: '24px',
        fill: colors.lightMediumGrey,
    },
    buttonBase: {
        padding: '6px 6px 4px 6px',
    },
    toggleFooterPadding: {
        padding: '8px 6px 2px 6px',
    },
    border: {
        borderRadius: '2px',
        border: `1px solid ${colors.lightGrey}`,
    },
};

const baseStyle = {
    icon: style.iconBase,
    container: style.buttonBase,
};

const activeStyle = {
    icon: { ...style.iconBase, fill: colors.royalBlue },
    container: {
        ...style.buttonBase,
        backgroundColor: colors.lightBlue,
    },
};

const getTableBtnStyle = activeVisualization =>
    arrayContains([REPORT_TABLE, EVENT_REPORT], activeVisualization)
        ? activeStyle
        : baseStyle;

const getChartBtnStyle = activeVisualization =>
    arrayContains([CHART, EVENT_CHART], activeVisualization)
        ? activeStyle
        : baseStyle;

const getMapBtnStyle = activeVisualization =>
    arrayContains([MAP], activeVisualization) ? activeStyle : baseStyle;

export const getItemTypeId = (itemTypeMap, visualizationType, domainType) => {
    const item = Object.values(itemTypeMap).find(
        item =>
            item.visualizationType === visualizationType &&
            item.domainType === domainType
    );
    return item.id;
};

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

        const onViewMap = () =>
            onSelectVisualization(
                getItemTypeId(itemTypeMap, VISUALIZATION_TYPE_MAP, domainType)
            );

        const toggleFooterBase = activeFooter ? activeStyle : baseStyle;

        const toggleFooter = {
            ...toggleFooterBase,
            container: {
                ...toggleFooterBase.container,
                ...style.toggleFooterPadding,
                ...style.border,
            },
        };

        return (
            <Fragment>
                <div style={{ marginRight: 10 }}>
                    <ItemHeaderButton
                        style={toggleFooter}
                        icon={'Message'}
                        onClick={onToggleFooter}
                    />
                </div>
                <div style={style.border}>
                    <ItemHeaderButton
                        style={getTableBtnStyle(activeVisualization)}
                        icon={'ViewList'}
                        onClick={onViewTable}
                    />
                    <ItemHeaderButton
                        style={getChartBtnStyle(activeVisualization)}
                        icon={'InsertChart'}
                        onClick={onViewChart}
                    />
                    <ItemHeaderButton
                        style={getMapBtnStyle(activeVisualization)}
                        icon={'Public'}
                        onClick={onViewMap}
                    />
                </div>
            </Fragment>
        );
    }
}

export default PluginItemHeaderButtons;
