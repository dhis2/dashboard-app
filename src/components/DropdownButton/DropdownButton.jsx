import { OfflineTooltip } from '@dhis2/analytics'
import { Button, Layer, Popper } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { ArrowDown, ArrowUp } from './assets/Arrow.jsx'
import styles from './DropdownButton.module.css'

const DropdownButton = ({
    children,
    open,
    onClick,
    disabledWhenOffline,
    component,
    content,
    ...rest
}) => {
    const anchorRef = useRef()

    const ArrowIconComponent = open ? ArrowUp : ArrowDown
    return (
        <div ref={anchorRef} className={styles.container}>
            <OfflineTooltip
                content={content}
                disabledWhenOffline={disabledWhenOffline}
                disabled={rest.disabled}
            >
                <Button onClick={onClick} type="button" {...rest}>
                    {children}
                    <ArrowIconComponent className={styles.arrow} />
                </Button>
            </OfflineTooltip>
            {open && (
                <Layer onBackdropClick={onClick} transparent>
                    <Popper placement="bottom-start" reference={anchorRef}>
                        {component}
                    </Popper>
                </Layer>
            )}
        </div>
    )
}

DropdownButton.propTypes = {
    children: PropTypes.node.isRequired,
    component: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    content: PropTypes.string,
    disabledWhenOffline: PropTypes.bool,
}

export default DropdownButton
