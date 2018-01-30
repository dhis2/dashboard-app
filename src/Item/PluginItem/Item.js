import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import ItemHeader from '../ItemHeader';
import ItemFooter from './ItemFooter';
import PluginItemHeaderButtons from './ItemHeaderButtons';

import * as favorite from './plugin';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';

import { SMALL_EXPAND, LARGE_EXPAND } from '../../ItemGrid/ItemGrid';

const style = {
    itemFooter: {
        flex: '0 0 320',
    },
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

const getPluginCredentials = d2 => {
    const api = d2.Api.getApi();
    const idx = api.baseUrl.indexOf('/api');
    const baseUrl = api.baseUrl.slice(0, idx);

    return {
        baseUrl,
        auth: api.defaultHeaders.Authorization,
    };
};

class Item extends Component {
    state = {
        showInterpretations: false,
        showDescription: false,
    };

    componentDidMount() {
        favorite.load(this.props.item, getPluginCredentials(this.context.d2));
    }

    notifyChangedContent = () => {
        const intHeight = this.state.showInterpretations ? LARGE_EXPAND : 0;
        const descHeight = this.state.showDescription ? SMALL_EXPAND : 0;

        this.props.onItemContentChanged(
            this.props.item.id,
            intHeight + descHeight
        );
    };

    onToggleInterpretations = () => {
        this.setState(
            {
                showInterpretations: !this.state.showInterpretations,
            },
            this.notifyChangedContent
        );
    };

    onToggleDescription = () => {
        this.setState(
            { showDescription: !this.state.showDescription },
            this.notifyChangedContent
        );
    };

    onSelectVisualization = targetType => {
        favorite.reload(
            this.props.item,
            targetType,
            getPluginCredentials(this.context.d2)
        );
    };

    render() {
        const item = this.props.item;
        const elementId = getGridItemDomId(item.id);

        const title = (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span title={favorite.getName(item)} style={style.title}>
                    {favorite.getName(item)}
                </span>
                <a href={favorite.getLink(item)} style={{ height: 16 }}>
                    <SvgIcon icon="Launch" style={style.icon} />
                </a>
                {favorite.getDescription(item) ? (
                    <div
                        onClick={this.onToggleDescription}
                        style={{ height: 16 }}
                    >
                        <SvgIcon icon="InfoOutline" style={style.icon} />
                    </div>
                ) : null}
            </div>
        );

        const actionButtons = !this.props.editMode ? (
            <PluginItemHeaderButtons
                item={item}
                onSelectVisualization={this.onSelectVisualization}
                onInterpretationsClick={this.onToggleInterpretations}
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
                {!this.props.editMode ? (
                    <ItemFooter
                        style={style.itemFooter}
                        item={item}
                        showInterpretations={this.state.showInterpretations}
                        onToggleInterpretations={this.onToggleInterpretations}
                        showDescription={this.state.showDescription}
                        onToggleDescription={this.onToggleDescription}
                    />
                ) : null}
            </Fragment>
        );
    }
}

Item.contextTypes = {
    d2: PropTypes.object,
};

export default Item;
