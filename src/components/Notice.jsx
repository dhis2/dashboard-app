import { NoticeBox, CenteredContent } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/Notice.module.css'

const Notice = ({ title, message }) => (
    <CenteredContent position="top">
        <div className={classes.noticeContainer}>
            <NoticeBox title={title} warning>
                {message}
            </NoticeBox>
        </div>
    </CenteredContent>
)

Notice.propTypes = {
    message: PropTypes.node,
    title: PropTypes.string,
}

export default Notice
