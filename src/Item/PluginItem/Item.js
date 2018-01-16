import React, { Component, Fragment } from 'react';

import ItemHeader from '../ItemHeader';
import ItemFooter from './ItemFooter';
import PluginItemHeaderButtons from './ItemHeaderButtons';
import { apiFetchFavorite } from '../../api';

import {
    getFavoriteObjectFromItem,
    getPluginItemConfig,
    loadFavorite,
} from './loadPlugin';

const style = {
    itemFooter: {
        flex: '0 0 320',
    },
};

// Plugin type map
const pluginTypeMap = {
    REPORT_TABLE: global.reportTablePlugin,
    CHART: global.chartPlugin,
};

// Get plugin by type
export const getPluginByType = type => pluginTypeMap[type];

const onButtonClick = (id, type, targetType) => {
    const plugin = getPluginByType(targetType);

    apiFetchFavorite(id, type).then(favorite => {
        const itemConfig = getPluginItemConfig(favorite, true);

        plugin.load(itemConfig);
    });
};

//TODO - do caching differently, does not belong here in Item
let cachedIds = [];
let cachedEdit = false;

const shouldPluginLoad = (item, edit) => {
    if (edit !== cachedEdit) {
        cachedIds = [];
        cachedEdit = edit;
    }

    if (cachedIds.indexOf(item.id) === -1) {
        cachedIds.push(item.id);

        return true;
    }

    return false;
};

class Item extends Component {
    state = {
        showInterpretations: false,
    };

    componentDidMount() {
        const { item, editMode } = this.props;

        if (shouldPluginLoad(item, editMode)) {
            loadFavorite(item);
        }
    }

    onToggleInterpretations = () => {
        this.setState({ showInterpretations: !this.state.showInterpretations });
        this.props.onToggleItemFooter(this.props.item.id);
    };

    render() {
        const item = this.props.item;
        const favorite = getFavoriteObjectFromItem(item);
        const pluginId = getPluginItemConfig(item).el;

        const actionButtons = !this.props.editMode ? (
            <PluginItemHeaderButtons
                onButtonClick={onButtonClick}
                onInterpretationsClick={this.onToggleInterpretations}
            />
        ) : null;

        return (
            <Fragment>
                <ItemHeader
                    title={favorite.name}
                    actionButtons={actionButtons}
                    editMode={this.props.editMode}
                />
                <div id={pluginId} className="dashboard-item-content" />
                {!this.props.editMode ? (
                    <ItemFooter
                        style={style.itemFooter}
                        item={item}
                        showInterpretations={this.state.showInterpretations}
                        onToggleInterpretations={this.onToggleInterpretations}
                    />
                ) : null}
            </Fragment>
        );
    }
}

export default Item;
