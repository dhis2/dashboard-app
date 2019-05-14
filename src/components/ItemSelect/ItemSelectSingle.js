import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { MenuItem, colors } from '@dhis2/ui-core';
import { getItemIcon } from '../../modules/itemTypes';

import { acAddDashboardItem } from '../../actions/editDashboard';

import classes from './styles/MenuItem.module.css';

const SingleItem = ({ item, onAddToDashboard }) => {
    const ItemIcon = getItemIcon(item.type);
    return (
        <MenuItem
            dense
            key={item.type}
            label={
                <div className={classes.menuItem}>
                    <div className={classes.itemTitle}>
                        <ItemIcon
                            style={{ margin: '6px', fill: colors.grey600 }}
                        />
                        <span>{item.name}</span>
                    </div>
                    <button
                        className={classes.buttonInsert}
                        onClick={onAddToDashboard}
                    >
                        {i18n.t('Insert')}
                    </button>
                </div>
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
            <MenuItem
                dense
                disabled
                label={
                    <p style={{ color: colors.grey800, fontWeight: '600' }}>
                        {category.header}
                    </p>
                }
            />
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
