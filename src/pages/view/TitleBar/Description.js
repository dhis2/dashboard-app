import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/Description.module.css'

const Description = ({ description, showDescription }) => {
    if (!showDescription) {
        return null
    }

    return (
        <div
            className={cx(
                classes.descContainer,
                description ? classes.desc : classes.noDesc
            )}
            data-test="dashboard-description"
        >
            {description || i18n.t('No description')}
        </div>
    )
}

Description.propTypes = {
    description: PropTypes.string,
    showDescription: PropTypes.bool,
}

export default Description
