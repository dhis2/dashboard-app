import React from 'react'
import i18n from '@dhis2/d2-i18n'

import classes from './PrintInfo.module.css'

const PrintInfo = () => {
    return (
        <div className={classes.infoWrapper}>
            <p className={classes.infoHeader}>
                {i18n.t('Print Preview: one item per page')}
            </p>
            <p className={classes.info}>
                {i18n.t(
                    'The pages below are a preview of how the dashboard items will be printed on a single page. Use the default printer settings for best results. This text will not be printed'
                )}
            </p>
            <hr className={classes.divider} />
        </div>
    )
}

export default PrintInfo
