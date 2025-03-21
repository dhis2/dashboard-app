import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import {
    sGetSelectedDisplayDescription,
    sGetSelectedIsEmbedded,
} from '../../reducers/selected.js'
import { sGetShowDescription } from '../../reducers/showDescription.js'
import classes from './styles/Description.module.css'

export const Description = () => {
    const showDescription = useSelector(sGetShowDescription)
    const description = useSelector(sGetSelectedDisplayDescription)
    const isEmbeddedDashboard = useSelector(sGetSelectedIsEmbedded)

    return showDescription ? (
        <p
            className={cx(classes.description, {
                [classes.empty]: !description,
                [classes.padded]: isEmbeddedDashboard,
            })}
            data-test="dashboard-description"
        >
            {description || i18n.t('No description')}
        </p>
    ) : null
}
