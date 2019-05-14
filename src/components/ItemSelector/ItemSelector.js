import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import Popover from '@material-ui/core/Popover';
import { InputField, Menu } from '@dhis2/ui-core';

import ItemSelectList from './ItemSelectList';
import ItemSelectSingle from './ItemSelectSingle';
import { singleItems, groupItems } from './selectableItems';
import { itemTypeMap } from '../../modules/itemTypes';

import './styles/ItemSelector.css';

const ItemSearchField = props => (
    <InputField
        filled
        name="Dashboard item search"
        label={i18n.t('Search for items to add to this dashboard')}
        type="text"
        onChange={props.onChange}
        onFocus={props.onFocus}
        value={props.value}
    />
);

class ItemSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            open: false,
            maxOptions: new Set(),
            items: undefined,
            filter: '',
        };
    }

    closeList = () => {
        this.setState({ open: false, filter: '' });
    };

    openList = event => {
        this.fetchItems();

        this.setState({
            anchorEl: event.currentTarget,
            open: true,
        });
    };

    setFilter = event => {
        this.setState({ filter: event.target.value }, this.fetchItems);
    };

    getGroupItems = items => {
        return groupItems.map(type => {
            const itemType = itemTypeMap[type.id];

            if (items && items[itemType.countName] > 0) {
                return (
                    <ItemSelectList
                        key={type.id}
                        type={type.id}
                        title={type.title}
                        items={items[itemType.endPointName]}
                        onChangeItemsLimit={this.fetchItems}
                    />
                );
            } else {
                return null;
            }
        });
    };

    popoverChildren = items => {
        const SingleItems = singleItems.map(category => (
            <ItemSelectSingle key={category.id} category={category} />
        ));
        const grpItems = this.getGroupItems(items);

        return grpItems.concat(SingleItems);
    };

    fetchItems = async type => {
        if (type) {
            const maxOptions = this.state.maxOptions;

            if (maxOptions.has(type)) {
                maxOptions.delete(type);
            } else {
                maxOptions.add(type);
            }

            this.setState({ maxOptions });
        } else {
            this.setState({
                maxOptions: new Set(),
            });
        }

        let queryString = '';
        if ([...this.state.maxOptions.values()].length) {
            queryString =
                'max=' + [...this.state.maxOptions.values()].join('&max=');
        }

        this.context.d2.Api.getApi()
            .get(`dashboards/q/${this.state.filter || ''}${queryString}`)
            .then(response => {
                this.setState({ items: response });
            })
            .catch(console.error);
    };

    render() {
        return (
            <Fragment>
                <ItemSearchField
                    value={this.state.filter}
                    onChange={this.setFilter}
                    onFocus={this.openList}
                />
                <Popover
                    className="dashboard-item-selector"
                    open={this.state.open}
                    onClose={this.closeList}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    style={{ height: '70vh' }}
                    PaperProps={{ style: { width: '700px' } }}
                    disableAutoFocus={true}
                    disableRestoreFocus={true}
                >
                    <Menu>{this.popoverChildren(this.state.items)}</Menu>
                </Popover>
            </Fragment>
        );
    }
}

ItemSelector.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default ItemSelector;
