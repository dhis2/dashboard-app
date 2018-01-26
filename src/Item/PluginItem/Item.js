import React, { Component, Fragment } from 'react';

import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import ItemHeader from '../ItemHeader';
import ItemFooter from './ItemFooter';
import PluginItemHeaderButtons from './ItemHeaderButtons';

import * as favorite from './plugin';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';

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

class Item extends Component {
    state = {
        showInterpretations: false,
        showDescription: false,
    };

    componentDidMount() {
        favorite.load(this.props.item);
    }

    onToggleInterpretations = () => {
        if (!this.state.showDescription) {
            this.props.onToggleItemExpanded(this.props.item.id);
        }
        this.setState({ showInterpretations: !this.state.showInterpretations });
    };

    onSelectVisualization = targetType => {
        favorite.reload(this.props.item, targetType);
    };

    onToggleDescription = () => {
        if (!this.state.showInterpretations) {
            this.props.onToggleItemExpanded(this.props.item.id);
        }
        this.setState({ showDescription: !this.state.showDescription });
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
                onSelectVisualization={this.onSelectVisualization}
                onInterpretationsClick={this.onToggleInterpretations}
            />
        ) : null;

        return (
            <Fragment>
                <ItemHeader title={title} actionButtons={actionButtons} />
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

export default Item;
