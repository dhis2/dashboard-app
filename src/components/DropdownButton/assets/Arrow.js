import PropTypes from 'prop-types'
import React from 'react'

/* eslint-disable react/no-unknown-property */
export function ArrowDown({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            className={className}
        >
            <path d="m5.29289 8.7071c.39053.3905 1.02369.3905 1.41422 0l2.99999-2.99999c.3905-.39053.3905-1.02369 0-1.41422-.3905-.39052-1.0237-.39052-1.4142 0l-2.2929 2.2929-2.29289-2.2929c-.39053-.39052-1.02369-.39052-1.41422 0-.39052.39053-.39052 1.02369 0 1.41422z" />
            <style jsx>{`
                svg {
                    fill: inherit;
                    block-size: 12px;
                    inline-size: 12px;
                    vertical-align: middle;
                    pointer-events: none;
                }
            `}</style>
        </svg>
    )
}
ArrowDown.propTypes = {
    className: PropTypes.string,
}

export function ArrowUp({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            className={className}
        >
            <path
                d="m5.29289 8.7071c.39053.3905 1.02369.3905 1.41422 0l2.99999-2.99999c.3905-.39053.3905-1.02369 0-1.41422-.3905-.39052-1.0237-.39052-1.4142 0l-2.2929 2.2929-2.29289-2.2929c-.39053-.39052-1.02369-.39052-1.41422 0-.39052.39053-.39052 1.02369 0 1.41422z"
                transform="matrix(1 0 0 -1 0 12.999974)"
            />
            <style jsx>{`
                svg {
                    fill: inherit;
                    block-size: 12px;
                    inline-size: 12px;
                    vertical-align: middle;
                    pointer-events: none;
                }
            `}</style>
        </svg>
    )
}
ArrowUp.propTypes = {
    className: PropTypes.string,
}

/* eslint-enable react/no-unknown-property */
