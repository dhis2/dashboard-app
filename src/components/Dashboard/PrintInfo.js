import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { a4LandscapeWidthPx } from '../../modules/printUtils'

import classes from './PrintInfo.module.css'

const PrintInfo = ({ type }) => {
    const width =
        a4LandscapeWidthPx < window.innerWidth
            ? a4LandscapeWidthPx
            : window.innerWidth

    return (
        <div className={classes.infoWrapper} style={{ width }}>
            <p className={classes.infoHeader}>
                {`${i18n.t('Print Preview')}: ${type}`}
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

PrintInfo.propTypes = {
    type: PropTypes.string,
}

export default PrintInfo
