import { Radio } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/DashboardTypeRadio.module.css'

export const DashboardTypeRadio = ({
    value,
    checked,
    initialFocus,
    onChange,
    icon,
    title,
    subtitle,
}) => (
    <Radio
        initialFocus={initialFocus}
        className={cx(styles.container, {
            [styles.checked]: checked,
        })}
        label={
            <div className={styles.content}>
                {icon}
                <div className={styles.text}>
                    <p className={styles.title}>{title}</p>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
            </div>
        }
        name="dashboard-type"
        value={value}
        checked={checked}
        onChange={onChange}
    />
)

DashboardTypeRadio.propTypes = {
    checked: PropTypes.bool,
    icon: PropTypes.node,
    initialFocus: PropTypes.bool,
    subtitle: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
}
