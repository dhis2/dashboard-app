import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import styles from './styles/DashboardTypeRadio.module.css'

export const DashboardTypeRadio = ({
    type,
    selectedType,
    initialFocus,
    onChange,
    icon,
    title,
    subtitle,
}) => {
    const ref = useRef(null)
    const checked = type === selectedType

    useEffect(() => {
        if (initialFocus) {
            ref.current?.focus({ focusVisible: true })
        }
    }, [initialFocus])

    return (
        <label
            htmlFor={type}
            className={cx(styles.container, {
                [styles.checked]: checked,
                [styles.unchecked]: !checked,
            })}
        >
            <input
                ref={ref}
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
    initialFocus: PropTypes.bool,
    selectedType: PropTypes.string,
    subtitle: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
}
