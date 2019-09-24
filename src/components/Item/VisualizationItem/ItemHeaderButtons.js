import React, { Component, Fragment } from 'react';
import MessageIcon from '@material-ui/icons/Message';
import TableIcon from '@material-ui/icons/ViewList';
import ChartIcon from '@material-ui/icons/InsertChart';
import MapIcon from '@material-ui/icons/Public';

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
    CHART_TYPE_SINGLE_VALUE,
} from '../../../modules/itemTypes';
import { colors, theme } from '@dhis2/ui-core';

const style = {
    iconBase: {
        width: '24px',
        height: '24px',
        fill: colors.grey500,
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
        border: `1px solid ${colors.grey200}`,
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
    icon: { ...style.iconBase, fill: theme.primary800 },
    container: {
        ...style.buttonBase,
        backgroundColor: theme.primary100,
    },
};

const inactiveStyle = disabled => (disabled ? disabledStyle : baseStyle);

const tableBtnStyle = (activeType, disabled) =>
    [REPORT_TABLE, EVENT_REPORT].includes(activeType)
        ? activeStyle
        : inactiveStyle(disabled);

const chartBtnStyle = (activeType, disabled) =>
    [CHART, EVENT_CHART].includes(activeType)
        ? activeStyle
        : inactiveStyle(disabled);

const mapBtnStyle = (activeType, disabled) =>
    [MAP].includes(activeType) ? activeStyle : inactiveStyle(disabled);

export const getItemTypeId = (itemTypeMap, visualizationType, domainType) => {
    const item = Object.values(itemTypeMap).find(
        item =>
            item.visualizationType === visualizationType &&
            item.domainType === domainType
    );
    return item.id;
};

const isSingleValue = (itemType, chartType) =>
    itemType === VISUALIZATION_TYPE_CHART &&
    chartType === CHART_TYPE_SINGLE_VALUE;

class VisualizationItemHeaderButtons extends Component {
    renderInterpretationButton() {
        const { activeFooter, onToggleFooter } = this.props;

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
                <ItemHeaderButton
                    style={toggleFooter.container}
                    onClick={onToggleFooter}
                >
                    <MessageIcon style={toggleFooter.icon} />
                </ItemHeaderButton>
            </Fragment>
        );
    }

    renderVisualizationButtons() {
        const {
            item,
            visualization,
            onSelectVisualization,
            activeType,
        } = this.props;

        if (isSingleValue(item.type, visualization.type)) {
            return null;
        }

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

        const tableButtonStyle = tableBtnStyle(activeType, disabled);
        const chartButtonStyle = chartBtnStyle(activeType, disabled);
        const mapButtonStyle = mapBtnStyle(activeType, disabled);

        // disable toggle buttons
        let disabled = false;

        if (item.type === VISUALIZATION_TYPE_CHART) {
            if (extractFavorite(item).type.match(/^YEAR_OVER_YEAR/)) {
                disabled = true;
            }
        }

        return (
            <div style={{ marginLeft: 10 }}>
                <div style={style.border}>
                    <ItemHeaderButton
                        disabled={disabled}
                        style={tableButtonStyle.container}
                        onClick={onViewTable}
                    >
                        <TableIcon style={tableButtonStyle.icon} />
                    </ItemHeaderButton>
                    <ItemHeaderButton
                        disabled={disabled}
                        style={chartButtonStyle.container}
                        onClick={onViewChart}
                    >
                        <ChartIcon style={chartButtonStyle.icon} />
                    </ItemHeaderButton>
                    {domainType === DOMAIN_TYPE_AGGREGATE ? (
                        <ItemHeaderButton
                            disabled={disabled}
                            style={mapButtonStyle.container}
                            onClick={onViewMap}
                        >
                            <MapIcon style={mapButtonStyle.icon} />
                        </ItemHeaderButton>
                    ) : null}
                </div>
            </div>
        );
    }

    render() {
        return (
            <Fragment>
                {this.renderInterpretationButton()}
                {this.renderVisualizationButtons()}
            </Fragment>
        );
    }
}

export default VisualizationItemHeaderButtons;
