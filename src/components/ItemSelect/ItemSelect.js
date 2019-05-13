import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import Popover from '@material-ui/core/Popover';
import { InputField, Menu } from '@dhis2/ui-core';

import { singleItems, listItems } from './selectableItems';
import { itemTypeMap } from '../../modules/itemTypes';
import ItemSelectList from './ItemSelectList';
import ItemSelectSingle from './ItemSelectSingle';

import './styles/ItemSelect.css';

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

class ItemSelect extends React.Component {
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

    getListItems = items => {
        return listItems.map(type => {
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
        const ListItems = this.getListItems(items);

        return ListItems.concat(SingleItems);
    };

    fetchItems = async maxOption => {
        const api = this.context.d2.Api.getApi();

        let queryString;

        if (maxOption) {
            const maxOptions = this.state.maxOptions;

            if (maxOptions.has(maxOption)) {
                maxOptions.delete(maxOption);
            } else {
                maxOptions.add(maxOption);
            }

            this.setState({
                maxOptions,
            });
        } else {
            this.setState({
                maxOptions: new Set(),
            });
        }

        if ([...this.state.maxOptions.values()].length) {
            queryString =
                'max=' + [...this.state.maxOptions.values()].join('&max=');
        }

        api.get(
            `dashboards/q/${this.state.filter || ''}${
                queryString ? `?${queryString}` : ''
            }`
        )
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

ItemSelect.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default ItemSelect;
