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
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    GRID_COLUMNS,
    GRID_COLUMN_PRESETS,
    MIN_GRID_COLUMNS,
    MAX_GRID_COLUMNS,
} from '../../modules/gridUtil.js'
import { LayoutFixedIcon } from './assets/LayoutFixed.jsx'
import { LayoutFreeflowIcon } from './assets/LayoutFreeflow.jsx'
import classes from './styles/LayoutModal.module.css'

const DEFAULT_COLUMNS = 3
const CUSTOM_COLUMNS = 'custom'

const GridColumnsSelector = ({ value, onChange }) => {
    const isPreset = GRID_COLUMN_PRESETS.includes(value)
    const [isCustom, setIsCustom] = useState(!isPreset)

    const handleSelectChange = ({ selected }) => {
        if (selected === CUSTOM_COLUMNS) {
            setIsCustom(true)
            return
        }
        setIsCustom(false)
        onChange(parseInt(selected, 10))
    }

    const handleCustomChange = ({ value: inputValue }) => {
        if (inputValue === '') {
            return
        }
        const parsed = parseInt(inputValue, 10)
        if (isNaN(parsed)) {
            return
        }
        onChange(Math.min(Math.max(parsed, MIN_GRID_COLUMNS), MAX_GRID_COLUMNS))
    }

    return (
        <div className={classes.gridColumnsOption}>
            <SingleSelectField
                label={i18n.t('Grid columns')}
                dense
                inputWidth="160px"
                selected={isCustom ? CUSTOM_COLUMNS : String(value)}
                onChange={handleSelectChange}
            >
                {GRID_COLUMN_PRESETS.map((preset) => (
                    <SingleSelectOption
                        key={preset}
                        value={String(preset)}
                        label={
                            preset === GRID_COLUMNS
                                ? i18n.t('{{count}} (pixel perfect)', {
                                      count: preset,
                                  })
                                : i18n.t('{{count}} columns', {
                                      count: preset,
                                  })
                        }
                    />
                ))}
                <SingleSelectOption
                    value={CUSTOM_COLUMNS}
                    label={i18n.t('Custom')}
                />
            </SingleSelectField>
            {isCustom && (
                <InputField
                    dense
                    type="number"
                    min={String(MIN_GRID_COLUMNS)}
                    max={String(MAX_GRID_COLUMNS)}
                    inputWidth="100px"
                    label={i18n.t('Number of columns')}
                    value={String(value)}
                    onChange={handleCustomChange}
                />
            )}
        </div>
    )
}

GridColumnsSelector.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
}

const isColumns = (value) => Boolean(value) || value === ''

const getColsSaveValue = (value) =>
    value === '' ? DEFAULT_COLUMNS : parseInt(value, 10)

export const LayoutModal = ({
    columns,
    gridColumns,
    onSaveLayout,
    onSetGridColumns,
    onClose,
}) => {
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const [cols, setCols] = useState(columns)
    const [gridCols, setGridCols] = useState(gridColumns)

    useEffect(() => {
        setCols(columns)
        setGridCols(gridColumns)
    }, [])

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
                        [classes.activeOption]: !isColumns(cols),
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
                        <h2 className={classes.title}>
                            {i18n.t('Flexible layout')}
                        </h2>
                        <p className={classes.description}>
                            {i18n.t(
                                'Dashboard items can be placed anywhere, at any size.'
                            )}
                        </p>
                        {!isColumns(cols) && onSetGridColumns && (
                            <div className={classes.columnOptions}>
                                <GridColumnsSelector
                                    value={gridCols}
                                    onChange={setGridCols}
                                />
                            </div>
                        )}
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
                            {i18n.t('Fixed layout')}
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
                                    dense
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
                            </div>
                        )}
                    </div>
                </div>
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
                                const layoutCols = getColsSaveValue(cols)
                                if (
                                    layoutCols === 0 &&
                                    onSetGridColumns &&
                                    gridCols !== gridColumns
                                ) {
                                    onSetGridColumns(gridCols)
                                }
                                onSaveLayout(layoutCols)
                                onClose()
                            }}
                        >
                            {i18n.t('Save layout')}
                        </Button>
                    </OfflineTooltip>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

LayoutModal.propTypes = {
    columns: PropTypes.number,
    gridColumns: PropTypes.number,
    onClose: PropTypes.func,
    onSaveLayout: PropTypes.func,
    onSetGridColumns: PropTypes.func,
}
