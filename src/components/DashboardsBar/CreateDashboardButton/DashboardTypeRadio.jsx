import { Radio, Help } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/DashboardTypeRadio.module.css'

export const DashboardTypeRadio = ({
    value,
    checked,
    initialFocus,
    onChange,

    title,
    subtitle,
}) => (
    <div>
        <Radio
            dense
            initialFocus={initialFocus}
            className={cx(styles.container, {
                [styles.checked]: checked,
            })}
            label={<p className={styles.title}>{title}</p>}
            name="dashboard-type"
            value={value}
            checked={checked}
            onChange={onChange}
        />
        <div className={styles.subtitle}>
            <Help>{subtitle}</Help>
        </div>
    </div>
)

DashboardTypeRadio.propTypes = {
    checked: PropTypes.bool,
    initialFocus: PropTypes.bool,
    subtitle: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
}
