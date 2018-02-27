import React, { Fragment } from 'react';
import i18n from 'd2-i18n';
import ItemHeader from '../ItemHeader';

const style = {
    margin: '10px',
    fontSize: '15px',
    lineHeight: '18px',
};

const SpacerItem = () => {
    return (
        <Fragment>
            <ItemHeader title={i18n.t('Spacer')} />
            <p style={style}>
                {i18n.t(
                    'Use a spacer to create empty vertical space between other dashboard items.'
                )}
            </p>
        </Fragment>
    );
};

export default SpacerItem;
