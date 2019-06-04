import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import Popover from '@material-ui/core/Popover';
import { InputField, Menu } from '@dhis2/ui-core';

import CategorizedMenuGroup from './CategorizedMenuGroup';
import SinglesMenuGroup from './SinglesMenuGroup';
import { singleItems, categorizedItems } from './selectableItems';
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

    getCategorizedMenuGroups = () =>
        categorizedItems.map(type => {
            const itemType = itemTypeMap[type];

            if (this.state.items && this.state.items[itemType.endPointName]) {
                const allItems = this.state.items[itemType.endPointName];
                const hasMore = allItems.length > 5;
                const items = this.state.maxOptions.has(type)
                    ? allItems
                    : allItems.slice(0, 5);

                return (
                    <CategorizedMenuGroup
                        key={type}
                        type={type}
                        title={itemType.pluralTitle}
                        items={items}
                        onChangeItemsLimit={this.fetchItems}
                        hasMore={hasMore}
                    />
                );
            }
            return null;
        });

    getSinglesMenuGroups = () =>
        singleItems.map(category => (
            <SinglesMenuGroup key={category.id} category={category} />
        ));

    getMenuGroups = () =>
        this.getCategorizedMenuGroups().concat(this.getSinglesMenuGroups());

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

        let queryString = '?count=6';
        if ([...this.state.maxOptions.values()].length) {
            queryString +=
                '&max=' + [...this.state.maxOptions.values()].join('&max=');
        }

        const filter = this.state.filter ? `/${this.state.filter}` : '';

        this.context.d2.Api.getApi()
            .get(`dashboards/q${filter}${queryString}`)
            .then(response => this.setState({ items: response }))
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
                    <Menu>{this.getMenuGroups()}</Menu>
                </Popover>
            </Fragment>
        );
    }
}

ItemSelector.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default ItemSelector;
