import React from 'react'

/* eslint-disable react/prop-types */
jest.mock('@dhis2/ui', () => {
    const originalModule = jest.requireActual('@dhis2/ui')

    return {
        __esModule: true,
        ...originalModule,
        Modal: function MockComponent(props) {
            return <div>{props.children}</div>
        },
        Button: function Mock({ children, ...props }) {
            return (
                <div className="ui-button" {...props}>
                    {children}
                </div>
            )
        },
        ButtonStrip: function Mock({ children, ...props }) {
            return (
                <div className="ui-buttonStrip" {...props}>
                    {children}
                </div>
            )
        },
        ModalActions: function Mock({ children, ...props }) {
            return (
                <div className="ui-modalActions" {...props}>
                    {children}
                </div>
            )
        },
        ModalContent: function Mock({ children, ...props }) {
            return (
                <div className="ui-modalContent" {...props}>
                    {children}
                </div>
            )
        },
        ModalTitle: function Mock({ children, ...props }) {
            return (
                <h1 className="ui-modalTitle" {...props}>
                    {children}
                </h1>
            )
        },
    }
})
/* eslint-enable react/prop-types */
