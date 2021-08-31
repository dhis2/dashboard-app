import PropTypes from 'prop-types'
import React from 'react'

const SearchIcon = ({ className, small }) =>
    small ? (
        <svg
            className={className}
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="m6 1c2.76142375 0 5 2.23857625 5 5 0 1.20065927-.4231997 2.30247496-1.12856994 3.16441794l4.48212334 4.48202866-.7071068.7071068-4.48202866-4.48212334c-.86194298.70537024-1.96375867 1.12856994-3.16441794 1.12856994-2.76142375 0-5-2.23857625-5-5s2.23857625-5 5-5zm0 1c-2.209139 0-4 1.790861-4 4s1.790861 4 4 4 4-1.790861 4-4-1.790861-4-4-4z"
                fill="#010101"
            />
        </svg>
    ) : (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
        >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
    )

SearchIcon.propTypes = {
    className: PropTypes.string,
    small: PropTypes.bool,
}

export default SearchIcon
