import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { InputField, TextAreaField, Radio, Button } from '@dhis2/ui'

import ItemSelector from './ItemSelector/ItemSelector'
import {
    acSetDashboardTitle,
    acSetDashboardDescription,
    acSetLayoutColumns,
    tSetDashboardItems,
    acSetItemConfigInsertPosition,
} from '../../actions/editDashboard'
import { orObject } from '../../modules/util'
import {
    sGetEditDashboardRoot,
    sGetItemConfigInsertPosition,
    sGetLayoutColumns,
} from '../../reducers/editDashboard'
import { LayoutFixedIcon } from './assets/LayoutFixed'
import { LayoutFreeflowIcon } from './assets/LayoutFreeflow'

import classes from './styles/TitleBar.module.css'
import { LayoutModal } from './LayoutModal'

const EditTitleBar = ({
    insertPosition,
    columns,
    description,
    name,
    onChangeInsertPosition,
    onChangeTitle,
    onChangeDescription,
    onSaveLayout,
}) => {
    const updateTitle = (_, e) => {
        onChangeTitle(e.target.value)
    }

    const updateDescription = (_, e) => {
        onChangeDescription(e.target.value)
    }

    const [showLayoutModal, setShowLayoutModal] = useState(false)

    return (
        <div className={classes.container}>
            <div className={classes.inputWrapper}>
                <InputField
                    name="Dashboard title input"
                    label={i18n.t('Dashboard title')}
                    type="text"
                    onChange={updateTitle}
                    value={name}
                    placeholder={i18n.t('Untitled dashboard')}
                    dataTest="dashboard-title-input"
                />
                <TextAreaField
                    name="Dashboard description input"
                    label={i18n.t('Dashboard description')}
                    onChange={updateDescription}
                    value={description}
                    dataTest="dashboard-description-input"
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
                                ? i18n.t('{{numberOfColumns}} columns', {
                                      numberOfColumns: columns.length, // TODO: Add pluralisation
                                  })
                                : i18n.t('Freeflow')}
                        </span>
                        <Button small onClick={() => setShowLayoutModal(true)}>
                            {i18n.t('Change layout')}
                        </Button>
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
                            onChange={value =>
                                value.checked &&
                                onChangeInsertPosition(value.name)
                            }
                            checked={insertPosition === 'END'}
                        />
                        <Radio
                            dense
                            label={i18n.t('Start of dashboard')}
                            name="START"
                            onChange={value =>
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
    onChangeDescription: PropTypes.func.isRequired,
    onChangeInsertPosition: PropTypes.func.isRequired,
    onChangeTitle: PropTypes.func.isRequired,
    onSaveLayout: PropTypes.func.isRequired,
    columns: PropTypes.array,
    description: PropTypes.string,
    insertPosition: PropTypes.string,
    name: PropTypes.string,
}

EditTitleBar.defaultProps = {
    name: '',
    description: '',
    insertPosition: 'END',
}

const mapStateToProps = state => {
    const selectedDashboard = orObject(sGetEditDashboardRoot(state))

    return {
        name: selectedDashboard.name,
        columns: sGetLayoutColumns(state),
        description: selectedDashboard.description,
        insertPosition: sGetItemConfigInsertPosition(state),
    }
}

const mapDispatchToProps = {
    onChangeTitle: acSetDashboardTitle,
    onChangeDescription: acSetDashboardDescription,
    onChangeInsertPosition: acSetItemConfigInsertPosition,
    onSaveLayout: columns => dispatch => {
        dispatch(
            acSetLayoutColumns(
                [...Array(columns).keys()].map(i => ({ index: i }))
            )
        )
        dispatch(tSetDashboardItems())
    },
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTitleBar)
