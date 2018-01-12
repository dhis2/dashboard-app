import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';

import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { itemTypeMap } from '../util';
import ItemSelectList from './ItemSelectList';

const ItemSearchField = props => (
    <div style={{ display: 'flex', alignItems: 'center', width: '400px' }}>
        <SvgIcon icon="Search" />
        <TextField
            hintText="Search favorite elements to add to dashboard"
            type="text"
            fullWidth={true}
            onClick={props.onClick}
            onChange={props.onChange}
            style={{ marginLeft: '10px' }}
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
            filter: null,
        };
    }

    closeList = () => {
        this.setState({ open: false, filter: null });
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
                    {[
                        { id: 'CHART', title: 'Charts' },
                        { id: 'REPORT_TABLE', title: 'Pivot tables' },
                        { id: 'MAP', title: 'Maps' },
                        { id: 'EVENT_CHART', title: 'Event charts' },
                        { id: 'EVENT_REPORT', title: 'Event reports' },
                        { id: 'USER', title: 'Users' },
                        { id: 'REPORT', title: 'Standard reports' },
                        { id: 'RESOURCE', title: 'Resources' },
                        { id: 'APP', title: 'Apps' },
                    ].map(type => {
                        const itemType = itemTypeMap[type.id];

                        if (
                            this.state.items &&
                            this.state.items[itemType.countName] > 0
                        ) {
                            return (
                                <ItemSelectList
                                    key={type.id}
                                    type={type.id}
                                    title={type.title}
                                    items={
                                        this.state.items[itemType.endPointName]
                                    }
                                    onRequestAdd={this.closeList}
                                    onChangeItemsLimit={this.fetchItems}
                                />
                            );
                        } else {
                            return null;
                        }
                    })}
                </Popover>
            </Fragment>
        );
    }
}

ItemSelect.contextTypes = {
    d2: PropTypes.object.isRequired,
};

export default ItemSelect;
