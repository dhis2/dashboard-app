import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import ItemHeader from '../ItemHeader';
import ItemFooter from './ItemFooter';
import PluginItemHeaderButtons from './ItemHeaderButtons';

import * as pluginManager from './plugin';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';
import { getBaseUrl } from '../../util';
import { itemTypeMap } from '../../itemTypes';

const style = {
    icon: {
        width: 16,
        height: 16,
        marginLeft: 3,
        cursor: 'pointer',
    },
    title: {
        overflow: 'hidden',
        maxWidth: '85%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    textDiv: {
        fontSize: '14px',
        fontStretch: 'normal',
        padding: '10px',
        lineHeight: '20px',
    },
};

const pluginCredentials = d2 => {
    return {
        baseUrl: getBaseUrl(d2),
        auth: d2.Api.getApi().defaultHeaders.Authorization,
    };
};

class Item extends Component {
    state = {
        showFooter: false,
        activeVisualization: this.props.item.type,
        pluginIsAvailable: !!itemTypeMap[this.props.item.type].plugin,
    };

    pluginCredentials = null;

    componentDidMount() {
        this.pluginCredentials = pluginCredentials(this.context.d2);

        if (this.state.pluginIsAvailable) {
            pluginManager.load(
                this.props.item,
                this.pluginCredentials,
                this.props.itemFilter
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.state.pluginIsAvailable &&
            nextProps.itemFilter !== this.props.itemFilter
        ) {
            pluginManager.load(
                this.props.item,
                this.pluginCredentials,
                nextProps.itemFilter
            );
        }
    }

    onToggleFooter = () => {
        this.setState(
            { showFooter: !this.state.showFooter },
            this.props.onToggleItemExpanded(this.props.item.id)
        );
    };

    onSelectVisualization = targetType => {
        pluginManager.unmount(this.props.item, this.state.activeVisualization);

        this.setState({ activeVisualization: targetType });
        pluginManager.reload(
            this.props.item,
            targetType,
            this.pluginCredentials,
            this.props.itemFilter
        );
    };

    render() {
        const item = this.props.item;
        const elementId = getGridItemDomId(item.id);
        const title = (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span title={pluginManager.getName(item)} style={style.title}>
                    {pluginManager.getName(item)}
                </span>
                {!this.props.editMode && this.state.pluginIsAvailable ? (
                    <a
                        href={pluginManager.getLink(item, this.context.d2)}
                        style={{ height: 16 }}
                    >
                        <SvgIcon icon="Launch" style={style.icon} />
                    </a>
                ) : null}
            </div>
        );

        const actionButtons =
            !this.props.editMode && this.state.pluginIsAvailable ? (
                <PluginItemHeaderButtons
                    item={item}
                    activeFooter={this.state.showFooter}
                    activeVisualization={this.state.activeVisualization}
                    onSelectVisualization={this.onSelectVisualization}
                    onToggleFooter={this.onToggleFooter}
                />
            ) : null;

        return (
            <Fragment>
                <ItemHeader
                    title={title}
                    actionButtons={actionButtons}
                    editMode={this.props.editMode}
                />
                <div id={elementId} className="dashboard-item-content">
                    {!this.state.pluginIsAvailable ? (
                        <div style={style.textDiv}>
                            Unable to load the plugin for this item
                        </div>
                    ) : null}
                </div>
                {!this.props.editMode && this.state.showFooter ? (
                    <ItemFooter item={item} />
                ) : null}
            </Fragment>
        );
    }
}

Item.contextTypes = {
    d2: PropTypes.object,
};

export default Item;
