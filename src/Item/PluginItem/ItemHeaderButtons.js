import React, { Component, Fragment } from 'react';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { REPORT_TABLE, CHART } from '../../util';

const style = {
    title: {
        paddingRight: 10,
        borderRight: '1px solid #ddd',
    },
};

const getIconButton = ({
    icon,
    targetType,
    onSelectVisualization,
    style = {},
}) => (
    <div
        style={{ cursor: 'pointer' }}
        onClick={() =>
            onSelectVisualization ? onSelectVisualization(targetType) : null
        }
    >
        <SvgIcon icon={icon} style={style} />
    </div>
);

class PluginItemHeaderButtons extends Component {
    render() {
        const { onSelectVisualization, onInterpretationsClick } = this.props;

        return (
            <Fragment>
                <div style={style.title}>
                    <div
                        style={{ cursor: 'pointer' }}
                        onClick={onInterpretationsClick}
                    >
                        <SvgIcon icon="Message" />
                    </div>
                </div>
                <div style={{ paddingLeft: 10, marginRight: 4 }}>
                    {getIconButton({
                        icon: 'ViewList',
                        targetType: REPORT_TABLE,
                        onSelectVisualization,
                    })}
                </div>
                <div style={{ marginRight: 4 }}>
                    {getIconButton({
                        icon: 'InsertChart',
                        targetType: CHART,
                        onSelectVisualization,
                    })}
                </div>
                {getIconButton({
                    icon: 'Public',
                })}
            </Fragment>
        );
    }
}

export default PluginItemHeaderButtons;
