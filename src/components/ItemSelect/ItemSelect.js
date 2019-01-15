import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import i18n from 'd2-i18n';
import SearchIcon from '@material-ui/icons/Search';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';

import { singleItems, listItems } from './selectableItems';
import { itemTypeMap } from '../../modules/itemTypes';
import ItemSelectList from './ItemSelectList';
import ItemSelectSingle from './ItemSelectSingle';
import { colors } from '../../modules/colors';

import './ItemSelect.css';

const styles = {
    filterField: {
        fontSize: '14px',
        height: '30px',
        marginLeft: '10px',
    },
    filterFieldInput: {
        top: '-9px',
        left: '1px',
    },
    filterFieldUnderline: {
        bottom: '10px',
    },
    filterFieldUnderlineFocus: {
        borderColor: '#aaa',
        borderWidth: '1px',
    },
    searchIcon: {
        fill: colors.muiDefaultGrey,
    },
};

const ItemSearchField = props => (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <SearchIcon style={styles.searchIcon} />
        <TextField
            hintText={i18n.t('Search for items to add to this dashboard')}
            fullWidth={true}
            value={props.value}
            onClick={props.onClick}
            onChange={props.onChange}
            style={styles.filterField}
            inputStyle={styles.filterFieldInput}
            hintStyle={styles.filterFieldHint}
            underlineStyle={styles.filterFieldUnderline}
            underlineFocusStyle={styles.filterFieldUnderlineFocus}
        />
    </div>
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
                    onClick={this.openList}
                    onChange={this.setFilter}
                />
                <Popover
                    className="dashboard-item-select"
                    open={this.state.open}
                    onRequestClose={this.closeList}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                    canAutoPosition={false}
                    autoCloseWhenOffScreen={false}
                    style={{
                        width: 700,
                        height: '70vh',
                        left: -1000,
                    }}
                >
                    {this.popoverChildren(this.state.items)}
                </Popover>
            </Fragment>
        );
    }
}

ItemSelect.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default ItemSelect;
