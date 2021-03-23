import React from 'react'
import PropTypes from 'prop-types'
import { MenuItem, colors } from '@dhis2/ui'

import classes from './styles/HeaderMenuItem.module.css'

const HeaderMenuItem = ({ title }) => (
    <MenuItem
        className={classes.item}
        dense
        key={title}
        disabled
        label={
            <span style={{ color: colors.grey800, fontWeight: '600' }}>
                {title}
            </span>
        }
    />
)

HeaderMenuItem.propTypes = {
    title: PropTypes.string.isRequired,
}

export default HeaderMenuItem
