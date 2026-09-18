import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/InlineButton.module.css'

// Flat, borderless icon + label button for non-primary toolbar actions.
// The icon inherits the button's text color (DHIS2 icons use currentColor),
// so it tints on hover/disabled automatically.
const InlineButton = ({
    icon,
    iconRight,
    children,
    onClick,
    disabled,
    destructive,
    dataTest,
    ...rest
}) => (
    <button
        type="button"
        className={cx(classes.button, {
            [classes.destructive]: destructive,
        })}
        onClick={onClick}
        disabled={disabled}
        data-test={dataTest}
        {...rest}
    >
        {icon && <span className={classes.icon}>{icon}</span>}
        <span>{children}</span>
        {iconRight && (
            <span className={cx(classes.icon, classes.iconRight)}>
                {iconRight}
            </span>
        )}
    </button>
)

InlineButton.propTypes = {
    children: PropTypes.node,
    dataTest: PropTypes.string,
    destructive: PropTypes.bool,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    iconRight: PropTypes.node,
    onClick: PropTypes.func,
}

export default InlineButton
