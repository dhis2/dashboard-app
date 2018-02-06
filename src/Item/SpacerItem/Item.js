import React, { Fragment } from 'react';
import ItemHeader from '../ItemHeader';

const style = {
    margin: '10px',
    fontSize: '15px',
    lineHeight: '18px',
};

const SpacerItem = () => {
    return (
        <Fragment>
            <ItemHeader title="Spacer" />
            <p style={style}>
                Use a spacer to create empty vertical space between other
                dashboard items.
            </p>
        </Fragment>
    );
};

export default SpacerItem;
