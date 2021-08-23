import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { InputField, TextAreaField, Radio, Button } from '@dhis2/ui'

import ItemSelector from './ItemSelector/ItemSelector'
import {
    acSetDashboardTitle,
    acSetDashboardDescription,
    acSetAddItemsTo,
} from '../../actions/editDashboard'
import { orObject } from '../../modules/util'
import { sGetEditDashboardRoot } from '../../reducers/editDashboard'
import { LayoutFixedIcon } from './assets/LayoutFixed'
import { LayoutFreeflowIcon } from './assets/LayoutFreeflow'

import classes from './styles/TitleBar.module.css'
import { LayoutModal } from './LayoutModal'

const EditTitleBar = ({
    addItemsTo,
    name,
    description,
    onChangeAddItemsTo,
    onChangeTitle,
    onChangeDescription,
}) => {
    const updateTitle = (_, e) => {
        onChangeTitle(e.target.value)
    }

    const updateDescription = (_, e) => {
        onChangeDescription(e.target.value)
    }

    const [columns, setColumns] = useState(3) // just for test
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
                <div className={classes.searchWrapper}>
                    <ItemSelector />
                </div>
                <div className={classes.layoutWrapper}>
                    <p className={classes.label}>{i18n.t('Layout')}</p>
                    <div className={classes.layoutOption}>
                        {columns ? <LayoutFixedIcon /> : <LayoutFreeflowIcon />}
                        <span>
                            {columns
                                ? i18n.t('{{count}} columns', {
                                      count: columns,
                                      defaultValue: '{{count}} column',
                                      defaultValue_plural: '{{count}} columns',
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
                                value.checked && onChangeAddItemsTo(value.name)
                            }
                            checked={addItemsTo === 'END'}
                        />
                        <Radio
                            dense
                            label={i18n.t('Start of dashboard')}
                            name="START"
                            onChange={value =>
                                value.checked && onChangeAddItemsTo(value.name)
                            }
                            checked={addItemsTo === 'START'}
                        />
                    </div>
                </div>
            </div>
            {showLayoutModal && (
                <LayoutModal
                    onClose={() => setShowLayoutModal(false)}
                    columns={columns}
                    setColumns={columns => setColumns(columns)}
                />
            )}
        </div>
    )
}

EditTitleBar.propTypes = {
    onChangeAddItemsTo: PropTypes.func.isRequired,
    onChangeDescription: PropTypes.func.isRequired,
    onChangeTitle: PropTypes.func.isRequired,
    addItemsTo: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
}

EditTitleBar.defaultProps = {
    name: '',
    description: '',
    addItemsTo: 'END',
}

const mapStateToProps = state => {
    const selectedDashboard = orObject(sGetEditDashboardRoot(state))

    return {
        name: selectedDashboard.name,
        description: selectedDashboard.description,
        addItemsTo: selectedDashboard.addItemsTo,
    }
}

const mapDispatchToProps = {
    onChangeTitle: acSetDashboardTitle,
    onChangeDescription: acSetDashboardDescription,
    onChangeAddItemsTo: acSetAddItemsTo,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTitleBar)
