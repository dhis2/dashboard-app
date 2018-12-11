import React, { Component, Fragment } from 'react';
import arrayContains from 'd2-utilizr/lib/arrayContains';

import { extractFavorite } from './plugin';
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
    DOMAIN_TYPE_AGGREGATE,
} from '../../../itemTypes';
import { colors } from '../../../colors';

const style = {
    iconBase: {
        width: '24px',
        height: '24px',
        fill: colors.lightMediumGrey,
    },
    buttonBase: {
        padding: '5px 6px 3px 6px',
    },
    buttonDisabled: {
        padding: '5px 6px 3px 6px',
        opacity: 0.5,
        cursor: 'unset',
    },
    toggleFooterPadding: {
        padding: '7px 6px 1px 6px',
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

const disabledStyle = {
    icon: style.iconBase,
    container: style.buttonDisabled,
};

const activeStyle = {
    icon: { ...style.iconBase, fill: colors.royalBlue },
    container: {
        ...style.buttonBase,
        backgroundColor: colors.lightBlue,
    },
};

const getTableBtnStyle = (activeVisualization, disabled) =>
    arrayContains([REPORT_TABLE, EVENT_REPORT], activeVisualization)
        ? activeStyle
        : disabled
        ? disabledStyle
        : baseStyle;

const getChartBtnStyle = (activeVisualization, disabled) =>
    arrayContains([CHART, EVENT_CHART], activeVisualization)
        ? activeStyle
        : disabled
        ? disabledStyle
        : baseStyle;

const getMapBtnStyle = (activeVisualization, disabled) =>
    arrayContains([MAP], activeVisualization)
        ? activeStyle
        : disabled
        ? disabledStyle
        : baseStyle;

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

        // disable toggle buttons
        let disabled = false;

        if (item.type === VISUALIZATION_TYPE_CHART) {
            if (extractFavorite(item).type.match(/^YEAR_OVER_YEAR/)) {
                disabled = true;
            }
        }

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
                        disabled={disabled}
                        style={getTableBtnStyle(activeVisualization, disabled)}
                        icon={'ViewList'}
                        onClick={onViewTable}
                    />
                    <ItemHeaderButton
                        disabled={disabled}
                        style={getChartBtnStyle(activeVisualization, disabled)}
                        icon={'InsertChart'}
                        onClick={onViewChart}
                    />
                    {domainType === DOMAIN_TYPE_AGGREGATE ? (
                        <ItemHeaderButton
                            disabled={disabled}
                            style={getMapBtnStyle(
                                activeVisualization,
                                disabled
                            )}
                            icon={'Public'}
                            onClick={onViewMap}
                        />
                    ) : null}
                </div>
            </Fragment>
        );
    }
}

export default PluginItemHeaderButtons;
