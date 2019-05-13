import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { MenuItem, Divider } from '@dhis2/ui-core';
import Button from '@dhis2/d2-ui-core/button/Button';
import { getItemIcon } from '../../modules/itemTypes';

import { acAddDashboardItem } from '../../actions/editDashboard';

const SingleItem = ({ item, onAddToDashboard }) => {
    const ItemIcon = getItemIcon(item.type);
    return (
        <MenuItem
            dense
            key={item.type}
            label={
                <p
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        margin: 0,
                    }}
                >
                    <ItemIcon style={{ margin: '6px' }} />
                    {item.name}
                    <Button
                        color="primary"
                        onClick={onAddToDashboard}
                        style={{
                            marginLeft: '5px',
                            marginRight: '5px',
                        }}
                    >
                        Insert
                    </Button>
                </p>
            }
        />
    );
};

const ItemSelectSingle = ({ acAddDashboardItem, category }) => {
    const addToDashboard = ({ type, content }) => () => {
        acAddDashboardItem({ type, content });
    };

    return (
        <Fragment>
            <MenuItem dense label={<p>{category.header}</p>} />
            <Divider style={{ margin: '8px 0' }} />
            {category.items.map(item => (
                <SingleItem
                    key={item.type}
                    item={item}
                    onAddToDashboard={addToDashboard(item)}
                />
            ))}
        </Fragment>
    );
};

export default connect(
    null,
    { acAddDashboardItem }
)(ItemSelectSingle);
