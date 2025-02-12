import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { DashboardTypeRadio } from './DashboardTypeRadio.js'
import styles from './styles/ChooseDashboardTypeModal.module.css'

const TYPE_INTERNAL = 'INTERNAL'
const TYPE_SUPERSET = 'SUPERSET'

export const ChooseDashboardTypeModal = ({
    onCancel,
    onSelectSuperset,
    onSelectInternal,
}) => {
    const [selectedType, setSelectedType] = useState(TYPE_INTERNAL)
    const handleDashboardTypeChange = useCallback(({ value }) => {
        setSelectedType(value)
    }, [])

    return (
        <Modal onClose={onCancel}>
            <form
                onSubmit={
                    selectedType === TYPE_INTERNAL
                        ? onSelectInternal
                        : onSelectSuperset
                }
            >
                <ModalTitle>
                    {i18n.t('New dashboard: choose type', {
                        nsSeparator: '###',
                    })}
                </ModalTitle>
                <ModalContent>
                    <fieldset className={styles.dashboardTypeRadioGroup}>
                        <DashboardTypeRadio
                            initialFocus
                            value={TYPE_INTERNAL}
                            checked={selectedType === TYPE_INTERNAL}
                            onChange={handleDashboardTypeChange}
                            title={i18n.t('Internal', {
                                nsSeparator: '###',
                            })}
                            subtitle={i18n.t(
                                'Show data and visualizations from this DHIS2 instance.'
                            )}
                        />
                        <DashboardTypeRadio
                            value={TYPE_SUPERSET}
                            checked={selectedType === TYPE_SUPERSET}
                            onChange={handleDashboardTypeChange}
                            title={i18n.t('External', {
                                nsSeparator: '###',
                            })}
                            subtitle={i18n.t(
                                'Embed a dashboard from a third-party source, like Superset.'
                            )}
                        />
                    </fieldset>
                </ModalContent>
                <ModalActions>
                    <div className={styles.buttonStrip}>
                        <Button primary type="submit">
                            {i18n.t('Continue')}
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
