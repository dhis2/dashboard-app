import PropTypes from 'prop-types'
import React from 'react'

export const ChevronDown = () => (
    <svg
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m11.29289 15.7071c.39053.3905 1.02369.3905 1.41422 0l4.99999-4.99999c.3905-.39053.3905-1.02369 0-1.41422-.3905-.39052-1.0237-.39052-1.4142 0l-4.2929 4.2929-4.29289-4.2929c-.39053-.39052-1.02369-.39052-1.41422 0-.39052.39053-.39052 1.02369 0 1.41422z"
            fill="#a0adba"
        />
    </svg>
)

export const ChevronUp = () => (
    <svg
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m11.2928932 8.29289322c.360484-.36048396.927715-.3882135 1.3200062-.08318861l.0942074.08318861 5 4.99999998c.3905243.3905243.3905243 1.0236893 0 1.4142136-.360484.3604839-.927715.3882135-1.3200062.0831886l-.0942074-.0831886-4.2928932-4.2921068-4.29289322 4.2921068c-.36048396.3604839-.92771502.3882135-1.32000622.0831886l-.09420734-.0831886c-.36048396-.360484-.3882135-.927715-.08318861-1.3200062l.08318861-.0942074z"
            fill="#a0adba"
        />
    </svg>
)

export const OfflineSaved = ({ className }) => (
    <svg
        className={className}
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m4.5 7v1h-1.5v6h10v-6h-1.5v-1h1.5c.5522847 0 1 .44771525 1 1v6c0 .5522847-.4477153 1-1 1h-10c-.55228475 0-1-.4477153-1-1v-6c0-.55228475.44771525-1 1-1zm5 3v1h-3v-1zm2.1130214-9.31661889.7739572.63323779-4.84985989 5.92760659-3.3906721-3.3906721.70710678-.70710678 2.60944661 2.60955339z"
            fill="inherit"
            fillRule="evenodd"
        />
    </svg>
)

OfflineSaved.propTypes = {
    className: PropTypes.string,
}