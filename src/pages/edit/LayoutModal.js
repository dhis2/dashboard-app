import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    InputField,
    Radio,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { LayoutFixedIcon } from './assets/LayoutFixed'
import { LayoutFreeflowIcon } from './assets/LayoutFreeflow'
import classes from './styles/LayoutModal.module.css'

const DEFAULT_COLUMN_AMOUNT = 3

export const LayoutModal = ({ columns, onSaveLayout, onClose }) => {
    const [cols, setCols] = useState(columns)

    const setColsWrapper = value => {
        const parsedValue = parseInt(value, 10)
        !isNaN(parsedValue) && setCols(parsedValue)
    }

    return (
        <Modal large onClose={onClose}>
            <ModalTitle>{i18n.t('Dashboard layout')}</ModalTitle>
            <ModalContent>
                <div
                    className={cx(classes.option, {
                        [classes.active]: !cols,
                    })}
                    onClick={() => setCols(0)}
                >
                    <Radio
                        onChange={() => setCols(0)}
                        checked={!cols}
                        className={classes.radio}
                    />
                    <div
                        className={cx(classes.iconWrapper, {
                            [classes.activeIcon]: !cols,
                        })}
                    >
                        <LayoutFreeflowIcon />
                    </div>
                    <div>
                        <h2 className={classes.title}>{i18n.t('Freeflow')}</h2>
                        <p className={classes.description}>
                            {i18n.t(
                                'Dashboard items can be placed anywhere, at any size.'
                            )}
                        </p>
                    </div>
                </div>
                <div
                    className={cx(classes.option, {
                        [classes.activeOption]: cols,
                    })}
                    onClick={() => {
                        if (!cols) {
                            setCols(DEFAULT_COLUMN_AMOUNT)
                        }
                    }}
                >
                    <Radio
                        onChange={() => {
                            if (!cols) {
                                setCols(DEFAULT_COLUMN_AMOUNT)
                            }
                        }}
                        checked={Boolean(cols)}
                        className={classes.radio}
                    />
                    <div
                        className={cx(classes.iconWrapper, {
                            [classes.activeIcon]: cols,
                        })}
                    >
                        <LayoutFixedIcon />
                    </div>
                    <div>
                        <h2 className={classes.title}>
                            {i18n.t('Fixed columns')}
                        </h2>
                        <p className={classes.description}>
                            {i18n.t(
                                'Dashboard items are automatically placed within fixed, horizontal columns. The number of columns can be adjusted.'
                            )}
                        </p>
                        {cols > 0 && (
                            <div className={classes.columnOptions}>
                                <InputField
                                    inputWidth="100px"
                                    type="number"
                                    min="1"
                                    label={i18n.t('Number of columns')}
                                    className={classes.columns}
                                    value={
                                        cols || cols === 0
                                            ? cols.toString()
                                            : ''
                                    }
                                    onChange={({ value }) =>
                                        setColsWrapper(value)
                                    }
                                />
                                {/* <InputField
                                    inputWidth="100px"
                                    type="number"
                                    label={i18n.t(
                                        'Gap size between columns (px)'
                                    )}
                                    className={classes.gap}
                                    // default value 16?
                                /> */}
                            </div>
                        )}
                    </div>
                </div>
                {/* <Divider />
                <InputField
                    helpText={i18n.t(
                        'Default height only applies to items added to a dashboard, this setting will not change existing items'
                    )}
                    label={i18n.t(
                        'Default height for items added to dashboard (rows)'
                    )}
                    name="defaultName"
                    placeholder=""
                    type="number"
                    inputWidth="100px"
                    // default value 64?
                /> */}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        primary
                        onClick={() => {
                            onSaveLayout(cols)
                            onClose()
                        }}
                    >
                        {i18n.t('Save layout')}
                    </Button>
                    {/* TODO: Only save the layout when "Save" is clicked? */}
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

LayoutModal.propTypes = {
    columns: PropTypes.number,
    onClose: PropTypes.func,
    onSaveLayout: PropTypes.func,
}
