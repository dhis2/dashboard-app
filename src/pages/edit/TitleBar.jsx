import { OfflineTooltip } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { InputField, TextAreaField, Radio, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
    acSetDashboardTitle,
    acSetDashboardDescription,
    acSetLayoutColumns,
    tSetDashboardItems,
    acSetItemConfigInsertPosition,
    acSetDashboardCode,
} from '../../actions/editDashboard.js'
import { orObject } from '../../modules/util.js'
import {
    sGetEditDashboardRoot,
    sGetItemConfigInsertPosition,
    sGetLayoutColumns,
} from '../../reducers/editDashboard.js'
import { LayoutFixedIcon } from './assets/LayoutFixed.jsx'
import { LayoutFreeflowIcon } from './assets/LayoutFreeflow.jsx'
import ItemSelector from './ItemSelector/ItemSelector.jsx'
import { LayoutModal } from './LayoutModal.jsx'
import classes from './styles/TitleBar.module.css'

const EditTitleBar = ({
    insertPosition,
    columns,
    description,
    name,
    code,
    onChangeCode,
    onChangeInsertPosition,
    onChangeTitle,
    onChangeDescription,
    onSaveLayout,
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
                    rows={6}
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
                                : i18n.t('Freeflow')}
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
    code: PropTypes.string,
    columns: PropTypes.array,
    description: PropTypes.string,
    insertPosition: PropTypes.string,
    name: PropTypes.string,
}

EditTitleBar.defaultProps = {
    name: '',
    code: '',
    description: '',
    insertPosition: 'END',
}

const mapStateToProps = (state) => {
    const selectedDashboard = orObject(sGetEditDashboardRoot(state))

    return {
        name: selectedDashboard.name,
        code: selectedDashboard.code,
        columns: sGetLayoutColumns(state),
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
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTitleBar)
