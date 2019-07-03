import React, { Fragment } from 'react';
import i18n from '@dhis2/d2-i18n';

import { colors } from '@dhis2/ui-core';
import ItemHeader from '../ItemHeader';

const style = {
    margin: '21px 28px',
    fontSize: '14px',
    lineHeight: '18px',
    color: colors.grey400,
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
