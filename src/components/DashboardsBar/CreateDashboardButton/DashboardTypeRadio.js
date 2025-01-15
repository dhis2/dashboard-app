import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/DashboardTypeRadio.module.css'

export const DashboardTypeRadio = ({
    type,
    selectedType,
    onChange,
    icon,
    title,
    subtitle,
}) => {
    const checked = type === selectedType
    return (
        <label
            htmlFor={type}
            className={cx(styles.container, {
                [styles.checked]: checked,
                [styles.unchecked]: !checked,
            })}
        >
            <input
                type="radio"
                name="dashboard-type"
                id={type}
                value={type}
                checked={checked}
                onChange={onChange}
            />
            <div className={styles.content}>
                {icon && <span className={styles.icon}>{icon}</span>}
                <div className={styles.text}>
                    <p className={styles.title}>{title}</p>
                    <p className={styles.subtitle}>{subtitle}</p>
                </div>
            </div>
        </label>
    )
}

DashboardTypeRadio.propTypes = {
    icon: PropTypes.node,
    selectedType: PropTypes.string,
    subtitle: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
}
