import { OfflineTooltip } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
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
import React, { useEffect, useState } from 'react'
import { GRID_COLUMNS } from '../../modules/gridUtil.js'
import { LayoutFixedIcon } from './assets/LayoutFixed.jsx'
import { LayoutFreeflowIcon } from './assets/LayoutFreeflow.jsx'
import classes from './styles/LayoutModal.module.css'

const DEFAULT_COLUMNS = 3

const isColumns = (value) => Boolean(value) || value === ''

const getColsSaveValue = (value) =>
    value === '' ? DEFAULT_COLUMNS : parseInt(value, 10)

export const LayoutModal = ({ columns, onSaveLayout, onClose }) => {
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const [cols, setCols] = useState(columns)

    useEffect(() => setCols(columns), [])

    const setColsWrapper = (value) => {
        const parsedValue = parseInt(value, 10)

        // handle values like ".2"
        if (isNaN(parsedValue) && value !== '') {
            setCols(1)
            return
        }

        if (parsedValue < 1) {
            setCols(1)
            return
        }

        if (parsedValue > GRID_COLUMNS) {
            setCols(GRID_COLUMNS)
            return
        }

        setCols(value)
    }

    return (
        <Modal large onClose={onClose}>
            <ModalTitle>{i18n.t('Dashboard layout')}</ModalTitle>
            <ModalContent>
                <div
                    className={cx(classes.option, {
                        [classes.active]: !isColumns(cols),
                    })}
                    onClick={() => setCols(0)}
                >
                    <Radio
                        onChange={() => setCols(0)}
                        checked={cols === 0}
                        className={classes.radio}
                    />
                    <div
                        className={cx(classes.iconWrapper, {
                            [classes.activeIcon]: !isColumns(cols),
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
                        [classes.activeOption]: isColumns(cols),
                    })}
                    onClick={() => {
                        if (cols === 0) {
                            setCols(DEFAULT_COLUMNS)
                        }
                    }}
                >
                    <Radio
                        onChange={() => {
                            if (cols === 0) {
                                setCols(DEFAULT_COLUMNS)
                            }
                        }}
                        checked={isColumns(cols)}
                        className={classes.radio}
                    />
                    <div
                        className={cx(classes.iconWrapper, {
                            [classes.activeIcon]: isColumns(cols),
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
                        {isColumns(cols) && (
                            <div className={classes.columnOptions}>
                                <InputField
                                    inputWidth="100px"
                                    type="number"
                                    min="1"
                                    max={String(GRID_COLUMNS)}
                                    placeholder={String(DEFAULT_COLUMNS)}
                                    label={i18n.t('Number of columns')}
                                    className={classes.columns}
                                    value={String(cols)}
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
                    <OfflineTooltip>
                        <Button
                            disabled={offline}
                            primary
                            onClick={() => {
                                onSaveLayout(getColsSaveValue(cols))
                                onClose()
                            }}
                        >
                            {i18n.t('Save layout')}
                        </Button>
                    </OfflineTooltip>
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
