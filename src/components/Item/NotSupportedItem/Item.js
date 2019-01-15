import React, { Fragment } from 'react';
import ItemHeader from '../ItemHeader';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

const NotSupportedItem = props => (
    <Fragment>
        <ItemHeader title={`Item type not supported: ${props.item.type}`} />
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
            }}
        >
            <NotInterestedIcon
                style={{ width: 100, height: 100, align: 'center' }}
                color="disabled"
            />
        </div>
    </Fragment>
);

export default NotSupportedItem;
