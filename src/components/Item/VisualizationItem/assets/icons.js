import React from 'react'
import { colors } from '@dhis2/ui'

export const ThreeDots = () => (
    <svg
        height="18"
        viewBox="0 0 18 18"
        width="18"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m4 7.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm10 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"
            fill="#6e7a8a"
        />
    </svg>
)

export const SpeechBubble = () => (
    <svg
        height="20"
        viewBox="0 0 20 20"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
        style={{ margin: '3px 2px 0 2px' }} // Temporary fix for the misaligned icon, should be removed once the icon is replaced
    >
        <path
            d="m20 2h-16c-1.1 0-1.99.9-1.99 2l-.01 18 4-4h14c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm-2 12h-12v-2h12zm0-3h-12v-2h12zm0-3h-12v-2h12z"
            fill="#6e7a8a"
            fillRule="evenodd"
            transform="translate(-2 -2)"
        />
    </svg>
)

export const Warning = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        fill={colors.grey600}
    >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
)
