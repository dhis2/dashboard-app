import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import ItemHeader from '../ItemHeader';
import ItemFooter from './ItemFooter';
import PluginItemHeaderButtons from './ItemHeaderButtons';

import * as pluginManager from './plugin';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';
import { getBaseUrl } from '../../util';

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
    };

    pluginCredentials = null;

    componentDidMount() {
        this.pluginCredentials = pluginCredentials(this.context.d2);

        pluginManager.load(this.props.item, this.pluginCredentials, {
            filter: this.props.itemFilter,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.itemFilter !== this.props.itemFilter) {
            pluginManager.load(this.props.item, this.pluginCredentials, {
                filter: nextProps.itemFilter,
            });
        }
    }

    onToggleFooter = () => {
        this.setState(
            { showFooter: !this.state.showFooter },
            this.props.onToggleItemExpanded(this.props.item.id)
        );
    };

    onSelectVisualization = targetType => {
        pluginManager.unmount(this.props.item, targetType);

        this.setState({ activeVisualization: targetType });
        pluginManager.reload(
            this.props.item,
            targetType,
            this.pluginCredentials,
            {
                filter: this.props.itemFilter,
            }
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
                <a
                    href={pluginManager.getLink(item, this.context.d2)}
                    style={{ height: 16 }}
                >
                    <SvgIcon icon="Launch" style={style.icon} />
                </a>
            </div>
        );

        const actionButtons = !this.props.editMode ? (
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
                <div id={elementId} className="dashboard-item-content" />
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
