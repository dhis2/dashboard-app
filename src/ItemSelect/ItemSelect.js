import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';

import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { itemTypeMap } from '../util';
import ItemSelectList from './ItemSelectList';
import ItemSelectSingle from './ItemSelectSingle';
import { singleItems, listItems } from './itemTypes';

const ItemSearchField = props => (
    <div style={{ display: 'flex', alignItems: 'center', width: '400px' }}>
        <SvgIcon icon="Search" />
        <TextField
            hintText="Search favorite elements to add to dashboard"
            type="text"
            fullWidth={true}
            value={props.value}
            onClick={props.onClick}
            onChange={props.onChange}
            style={{ marginLeft: '10px' }}
        />
    </div>
);

const getListItems = items => {
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

const popoverChildren = items => {
    const SingleItems = singleItems.map(cat => (
        <ItemSelectSingle key={cat.category} category={cat} />
    ));
    const ListItems = getListItems(items);

    return ListItems.concat(SingleItems);
};

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

        api
            .get(
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
                    onClick={this.openList}
                    onChange={this.setFilter}
                />
                <Popover
                    open={this.state.open}
                    onRequestClose={this.closeList}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                    canAutoPosition={false}
                    autoCloseWhenOffScreen={false}
                    style={{
                        width: 700,
                        height: 900,
                        overflow: 'auto',
                        left: -1000,
                    }}
                >
                    {popoverChildren(this.state.items)}
                </Popover>
            </Fragment>
        );
    }
}

ItemSelect.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default ItemSelect;
