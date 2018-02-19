import React, { Fragment } from 'react';
import { t } from 'dhis2-i18n';
import { Trans } from 'react-i18next';
import ItemHeader from '../ItemHeader';

const style = {
    margin: '10px',
    fontSize: '15px',
    lineHeight: '18px',
};

const SpacerItem = () => {
    return (
        <Fragment>
            <ItemHeader title={t('Spacer')} />
            <p style={style}>
                <Trans>
                    Use a spacer to create empty vertical space between other
                    dashboard items.
                </Trans>
            </p>
        </Fragment>
    );
};

export default SpacerItem;
