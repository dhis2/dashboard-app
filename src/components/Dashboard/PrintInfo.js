import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { a4LandscapeWidthPx } from '../../modules/printUtils'

import classes from './PrintInfo.module.css'

const PrintInfo = ({ isLayout }) => {
    const maxWidth =
        a4LandscapeWidthPx < window.innerWidth
            ? a4LandscapeWidthPx
            : window.innerWidth

    const infoPartOne = isLayout
        ? i18n.t(
              'The pages below are a preview of how the dashboard layout will be printed.'
          )
        : i18n.t(
              'The pages below are a preview of how each dashboard item will be printed on a separate page.'
          )

    const infoPartTwo = i18n.t(
        'Use the default printer settings for best results and check that all dashboard items have finished loading before printing. This text will not be printed.'
    )

    const infoHeader = isLayout
        ? i18n.t('dashboard layout')
        : i18n.t('one item per page')

    return (
        <div className={classes.infoWrapper}>
            <p className={classes.infoHeader}>
                {`${i18n.t('Print Preview')}: ${infoHeader}`}
            </p>
            <div style={{ maxWidth }}>
                <p
                    className={classes.info}
                >{`${infoPartOne} ${infoPartTwo}`}</p>
            </div>
            <hr className={classes.divider} />
        </div>
    )
}

PrintInfo.propTypes = {
    isLayout: PropTypes.bool,
}

export default PrintInfo
