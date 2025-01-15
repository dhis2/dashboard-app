import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState, useRef } from 'react'
import { DashboardTypeRadio } from './DashboardTypeRadio.js'
import { IconDashboardExternal } from './IconDashboardExternal.js'
import { IconDashboardInternal } from './IconDashboardInternal.js'
import styles from './styles/ChooseDashboardTypeModal.module.css'

const TYPE_INTERNAL = 'INTERNAL'
const TYPE_SUPERSET = 'SUPERSET'

const autoFocus = (element) => {
    element?.focus()
}

export const ChooseDashboardTypeModal = ({
    onCancel,
    onSelectSuperset,
    onSelectInternal,
}) => {
    const {
        systemInfo: { systemName },
    } = useConfig()
    const [selectedType, setSelectedType] = useState(TYPE_INTERNAL)
    const handleDashboardTypeChange = useCallback((event) => {
        setSelectedType(event.target.value)
    }, [])
    const isInternal = selectedType === TYPE_INTERNAL

    return (
        <Modal>
            <form onSubmit={isInternal ? onSelectInternal : onSelectSuperset}>
                <ModalTitle>
                    {i18n.t('New dashboard: choose type', {
                        nsSeparator: '###',
                    })}
                </ModalTitle>
                <ModalContent>
                    <fieldset
                        ref={autoFocus}
                        className={styles.dashboardTypeRadioGroup}
                        tabIndex={0}
                    >
                        <DashboardTypeRadio
                            type={TYPE_INTERNAL}
                            selectedType={selectedType}
                            onChange={handleDashboardTypeChange}
                            icon={<IconDashboardInternal />}
                            title={i18n.t(
                                'Internal: Data from {{systemName}}',
                                {
                                    systemName,
                                    nsSeparator: '###',
                                }
                            )}
                            subtitle={i18n.t(
                                'Show data and visualizations from this DHIS2 instance.'
                            )}
                        />
                        <DashboardTypeRadio
                            type={TYPE_SUPERSET}
                            selectedType={selectedType}
                            onChange={handleDashboardTypeChange}
                            icon={<IconDashboardExternal />}
                            title={i18n.t(
                                'External: Data from another source',
                                {
                                    nsSeparator: '###',
                                }
                            )}
                            subtitle={i18n.t(
                                'Embed a dashboard from a third-party source, like Superset.'
                            )}
                        />
                    </fieldset>
                </ModalContent>
                <ModalActions>
                    <div className={styles.buttonStrip}>
                        <Button primary type="submit">
                            {isInternal
                                ? i18n.t('Create dashboard')
                                : i18n.t('Configure source')}
                        </Button>
                        <Button secondary onClick={onCancel}>
                            {i18n.t('Cancel')}
                        </Button>
                    </div>
                </ModalActions>
            </form>
        </Modal>
    )
}

ChooseDashboardTypeModal.propTypes = {
    onCancel: PropTypes.func,
    onSelectInternal: PropTypes.func,
    onSelectSuperset: PropTypes.func,
}
