import { OfflineTooltip } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    InputField,
    TextAreaField,
    Radio,
    Button,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
    acSetDashboardTitle,
    acSetDashboardDescription,
    acSetLayoutColumns,
    tSetDashboardItems,
    tSetEditGridColumns,
    acSetItemConfigInsertPosition,
    acSetDashboardCode,
} from '../../actions/editDashboard.js'
import {
    GRID_COLUMNS,
    GRID_COLUMN_PRESETS,
    MIN_GRID_COLUMNS,
    MAX_GRID_COLUMNS,
} from '../../modules/gridUtil.js'
import { orObject } from '../../modules/util.js'
import {
    sGetEditDashboardRoot,
    sGetItemConfigInsertPosition,
    sGetLayoutColumns,
    sGetEditGridColumns,
} from '../../reducers/editDashboard.js'
import { LayoutFixedIcon } from './assets/LayoutFixed.jsx'
import { LayoutFreeflowIcon } from './assets/LayoutFreeflow.jsx'
import ItemSelector from './ItemSelector/ItemSelector.jsx'
import { LayoutModal } from './LayoutModal.jsx'
import classes from './styles/TitleBar.module.css'

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
        onChange(
            Math.min(Math.max(parsed, MIN_GRID_COLUMNS), MAX_GRID_COLUMNS)
        )
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

const EditTitleBar = ({
    insertPosition = 'END',
    columns,
    gridColumns,
    description = '',
    name = '',
    code = '',
    onChangeCode,
    onChangeInsertPosition,
    onChangeTitle,
    onChangeDescription,
    onSaveLayout,
    onSetGridColumns,
}) => {
    const { isDisconnected: offline } = useDhis2ConnectionStatus()

    const updateTitle = (_, e) => {
        onChangeTitle(e.target.value)
    }

    const updateCode = (_, e) => {
        onChangeCode(e.target.value)
    }

    const updateDescription = (_, e) => {
        onChangeDescription(e.target.value)
    }

    const [showLayoutModal, setShowLayoutModal] = useState(false)

    return (
        <div className={classes.container}>
            <div className={classes.inputWrapper}>
                <div className={classes.inputFieldWrapper}>
                    <InputField
                        name="Dashboard title input"
                        label={i18n.t('Dashboard title')}
                        type="text"
                        onChange={updateTitle}
                        value={name}
                        placeholder={i18n.t('Untitled dashboard')}
                        dataTest="dashboard-title-input"
                        dense
                    />
                    <InputField
                        name="Dashboard code input"
                        label={i18n.t('Dashboard code')}
                        type="text"
                        onChange={updateCode}
                        value={code}
                        dataTest="dashboard-code-input"
                        dense
                        {...(code.length > 50 && {
                            error: true,
                            validationText: i18n.t(
                                "Code can't be longer than 50 characters"
                            ),
                        })}
                    />
                </div>
                <TextAreaField
                    name="Dashboard description input"
                    label={i18n.t('Dashboard description')}
                    onChange={updateDescription}
                    value={description}
                    dataTest="dashboard-description-input"
                    rows={5}
                    dense
                />
            </div>
            <div className={classes.searchContainer}>
                <div className={classes.layoutWrapper}>
                    <p className={classes.label}>{i18n.t('Layout')}</p>
                    <div className={classes.layoutOption}>
                        {columns.length ? (
                            <LayoutFixedIcon />
                        ) : (
                            <LayoutFreeflowIcon />
                        )}
                        <span className={classes.layoutValue}>
                            {columns.length
                                ? i18n.t('{{count}} columns', {
                                      count: columns.length,
                                      defaultValue: '{{count}} column',
                                      defaultValue_plural: '{{count}} columns',
                                  })
                                : i18n.t('Flexible layout')}
                        </span>
                        <OfflineTooltip>
                            <Button
                                disabled={offline}
                                small
                                onClick={() => setShowLayoutModal(true)}
                            >
                                {i18n.t('Change layout')}
                            </Button>
                        </OfflineTooltip>
                    </div>
                    {columns.length === 0 && (
                        <GridColumnsSelector
                            value={gridColumns}
                            onChange={onSetGridColumns}
                        />
                    )}
                </div>
                <div className={classes.positionWrapper}>
                    <p className={classes.label}>
                        {i18n.t('Add new items to')}
                    </p>
                    <div className={classes.positionOptions}>
                        <Radio
                            dense
                            label={i18n.t('End of dashboard')}
                            name="END"
                            onChange={(value) =>
                                value.checked &&
                                onChangeInsertPosition(value.name)
                            }
                            checked={insertPosition === 'END'}
                        />
                        <Radio
                            dense
                            label={i18n.t('Start of dashboard')}
                            name="START"
                            onChange={(value) =>
                                value.checked &&
                                onChangeInsertPosition(value.name)
                            }
                            checked={insertPosition === 'START'}
                        />
                    </div>
                </div>
                <div className={classes.searchWrapper}>
                    <ItemSelector />
                </div>
            </div>
            {showLayoutModal && (
                <LayoutModal
                    onClose={() => setShowLayoutModal(false)}
                    columns={columns.length}
                    onSaveLayout={onSaveLayout}
                />
            )}
        </div>
    )
}

EditTitleBar.propTypes = {
    onChangeCode: PropTypes.func.isRequired,
    onChangeDescription: PropTypes.func.isRequired,
    onChangeInsertPosition: PropTypes.func.isRequired,
    onChangeTitle: PropTypes.func.isRequired,
    onSaveLayout: PropTypes.func.isRequired,
    onSetGridColumns: PropTypes.func.isRequired,
    code: PropTypes.string,
    columns: PropTypes.array,
    description: PropTypes.string,
    gridColumns: PropTypes.number,
    insertPosition: PropTypes.string,
    name: PropTypes.string,
}

const mapStateToProps = (state) => {
    const selectedDashboard = orObject(sGetEditDashboardRoot(state))

    return {
        name: selectedDashboard.name,
        code: selectedDashboard.code,
        columns: sGetLayoutColumns(state),
        gridColumns: sGetEditGridColumns(state),
        description: selectedDashboard.description,
        insertPosition: sGetItemConfigInsertPosition(state),
    }
}

const mapDispatchToProps = {
    onChangeCode: acSetDashboardCode,
    onChangeTitle: acSetDashboardTitle,
    onChangeDescription: acSetDashboardDescription,
    onChangeInsertPosition: acSetItemConfigInsertPosition,
    onSaveLayout: (columns) => (dispatch) => {
        dispatch(
            acSetLayoutColumns(
                [...Array(columns).keys()].map((i) => ({ index: i }))
            )
        )
        dispatch(tSetDashboardItems())
    },
    onSetGridColumns: tSetEditGridColumns,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTitleBar)
