import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

import Button from 'd2-ui/lib/button/Button';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { acAddDashboardItem } from '../actions/editDashboard';
import { sGetEditDashboard } from '../reducers/editDashboard';
import { getYMax } from '../ItemGrid/gridUtil';

const mapTypeItem = {
    MESSAGES: { icon: 'Email', name: 'Messages' },
};

const AppItem = ({ type, onAddToDashboard }) => {
    const item = mapTypeItem[type];

    return (
        <ListItem
            key={type}
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

const ItemSelectApp = ({ dashboardItems, acAddDashboardItem }) => {
    const addToDashboard = type => () => {
        const yValue = getYMax(dashboardItems);

        acAddDashboardItem({ type, content: 'true' }, yValue);
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
                <h3>App items</h3>
            </div>
            <Divider />
            <List>
                {Object.keys(mapTypeItem).map(type => (
                    <AppItem
                        key={type}
                        type={type}
                        onAddToDashboard={addToDashboard(type)}
                    />
                ))}
            </List>
        </Fragment>
    );
};

export default connect(
    state => ({
        dashboardItems: sGetEditDashboard(state).dashboardItems,
    }),
    {
        acAddDashboardItem,
    }
)(ItemSelectApp);
