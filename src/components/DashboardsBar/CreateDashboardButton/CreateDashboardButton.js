import { Button, IconAdd16 } from '@dhis2/ui'
import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useIsSupersetSupported } from '../../SystemSettingsProvider.js'
import { CreateSupersetDashboardModal } from '../ConfigureSupersetDashboard/index.js'
import { ChooseDashboardTypeModal } from './ChooseDashboardTypeModal.js'
import styles from './styles/CreateDashboardButton.module.css'

export const CreateDashboardButton = () => {
    const history = useHistory()
    const isSupersetSupported = useIsSupersetSupported()
    const [isChooseDashboardTypeModalOpen, setIsChooseDashboardTypeModalOpen] =
        useState(false)
    const [
        isCreateSupersetDashboardModalOpen,
        setIsCreateSupersetDashboardModalOpen,
    ] = useState(false)
    const navigateToNewInternalDashboardView = useCallback(() => {
        history.push('/new')
    }, [history])
    const handleCreateButtonClick = useCallback(() => {
        if (isSupersetSupported) {
            setIsChooseDashboardTypeModalOpen(true)
        } else {
            navigateToNewInternalDashboardView()
        }
    }, [isSupersetSupported, navigateToNewInternalDashboardView])

    return (
        <>
            <Button
                onClick={handleCreateButtonClick}
                secondary
                small
                icon={<IconAdd16 />}
                className={styles.createDashboardButton}
                dataTest="new-button"
            />
            {isChooseDashboardTypeModalOpen && (
                <ChooseDashboardTypeModal
                    onCancel={() => {
                        setIsChooseDashboardTypeModalOpen(false)
                    }}
                    onSelectSuperset={() => {
                        setIsChooseDashboardTypeModalOpen(false)
                        setIsCreateSupersetDashboardModalOpen(true)
                    }}
                    onSelectInternal={() => {
                        setIsChooseDashboardTypeModalOpen(false)
                        navigateToNewInternalDashboardView()
                    }}
                />
            )}
            {isCreateSupersetDashboardModalOpen && (
                <CreateSupersetDashboardModal
                    backToChooseDashboardModal={() => {
                        setIsCreateSupersetDashboardModalOpen(false)
                        setIsChooseDashboardTypeModalOpen(true)
                    }}
                    closeModal={() => {
                        setIsCreateSupersetDashboardModalOpen(false)
                    }}
                />
            )}
        </>
    )
}
