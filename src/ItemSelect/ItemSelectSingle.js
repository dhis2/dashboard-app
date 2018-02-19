import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

import Button from 'd2-ui/lib/button/Button';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { acAddDashboardItem } from '../actions/editDashboard';

const SingleItem = ({ item, onAddToDashboard }) => {
    return (
        <ListItem
            key={item.type}
            leftIcon={<SvgIcon icon={item.icon} style={{ margin: '6px' }} />}
            innerDivStyle={{ padding: '0px 0px 0px 42px' }}
            hoverColor="transparent"
            primaryText={
                <p
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        margin: 0,
                    }}
                >
                    {item.name}
                    <Button color="primary" onClick={onAddToDashboard}>
                        + ADD
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
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingLeft: '16px',
                }}
            >
                <h3>{category.header}</h3>
            </div>
            <Divider />
            <List>
                {category.items.map(item => (
                    <SingleItem
                        key={item.type}
                        item={item}
                        onAddToDashboard={addToDashboard(item)}
                    />
                ))}
            </List>
        </Fragment>
    );
};

export default connect(
    null,
    {
        acAddDashboardItem,
    },
    (stateProps, dispatchProps, ownProps) => ({
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
    })
)(ItemSelectSingle);
