import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MessageIcon from '@material-ui/icons/Message';
import TableIcon from '@material-ui/icons/ViewList';
import ChartIcon from '@material-ui/icons/InsertChart';
import MapIcon from '@material-ui/icons/Public';

import { extractFavorite } from './plugin';
import ItemHeaderButton from '../ItemHeaderButton';
import {
    CHART,
    MAP,
    REPORT_TABLE,
    EVENT_CHART,
    EVENT_REPORT,
    isTrackerDomainType,
    hasMapView,
} from '../../../modules/itemTypes';
import { colors, theme } from '@dhis2/ui-core';
import { isSingleValue } from '@dhis2/analytics';

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
            onSelectActiveType,
            activeType,
        } = this.props;

        if (isSingleValue(visualization.type)) {
            return null;
        }

        const onViewTable = () =>
            onSelectActiveType(
                isTrackerDomainType(item.type) ? EVENT_REPORT : REPORT_TABLE
            );

        const onViewChart = () =>
            onSelectActiveType(
                isTrackerDomainType(item.type) ? EVENT_CHART : CHART
            );

        const onViewMap = () => onSelectActiveType(MAP);

        // disable toggle buttons
        let disabled = false;

        if (item.type === CHART) {
            if (extractFavorite(item).type.match(/^YEAR_OVER_YEAR/)) {
                disabled = true;
            }
        }

        const tableButtonStyle = tableBtnStyle(activeType, disabled);
        const chartButtonStyle = chartBtnStyle(activeType, disabled);
        const mapButtonStyle = mapBtnStyle(activeType, disabled);

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
                    {hasMapView(item.type) ? (
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

VisualizationItemHeaderButtons.propTypes = {
    activeFooter: PropTypes.bool,
    activeType: PropTypes.string,
    item: PropTypes.object,
    visualization: PropTypes.object,
    onSelectActiveType: PropTypes.func,
    onToggleFooter: PropTypes.func,
};

export default VisualizationItemHeaderButtons;
