import i18n from '@dhis2/d2-i18n'
import { NoticeBox, CenteredContent } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/NotSupportedNotice.module.css'

const NotSupportedNotice = ({ message }) => (
    <CenteredContent position="top">
        <div className={classes.noticeContainer}>
            <NoticeBox title={i18n.t('Not supported')} warning>
                {message}
            </NoticeBox>
        </div>
    </CenteredContent>
)

NotSupportedNotice.propTypes = {
    message: PropTypes.string,
}

export default NotSupportedNotice
