import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ItemHeader from '../ItemHeader';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

const NotSupportedItem = props => (
    <Fragment>
        <ItemHeader
            title={`Item type not supported: ${props.item.type}`}
            itemId={props.item.id}
        />
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

NotSupportedItem.propTypes = {
    item: PropTypes.object,
};

export default NotSupportedItem;
