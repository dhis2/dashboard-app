import React from 'react'

/* eslint-disable react/prop-types */
const colors = { secondary100: 'secondary100' }
const spacers = { dp12: '12' }
const Modal = function MockComponent(props) {
    return <div>{props.children}</div>
}
const Button = function Mock({ children, ...props }) {
    return (
        <div className="ui-button" {...props}>
            {children}
        </div>
    )
}
const ButtonStrip = function Mock({ children, ...props }) {
    return (
        <div className="ui-buttonStrip" {...props}>
            {children}
        </div>
    )
}
const ModalActions = function Mock({ children, ...props }) {
    return (
        <div className="ui-modalActions" {...props}>
            {children}
        </div>
    )
}
const ModalContent = function Mock({ children, ...props }) {
    return (
        <div className="ui-modalContent" {...props}>
            {children}
        </div>
    )
}
const ModalTitle = function Mock({ children, ...props }) {
    return (
        <h1 className="ui-modalTitle" {...props}>
            {children}
        </h1>
    )
}

export {
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Modal,
    Button,
    colors,
    spacers,
}

/* eslint-enable react/prop-types */
