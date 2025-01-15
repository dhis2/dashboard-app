import { Button, IconAdd16 } from '@dhis2/ui'
import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useHasSupersetSupport } from '../../SystemSettingsProvider.js'
import { ChooseDashboardTypeModal } from './ChooseDashboardTypeModal.js'
import { CreateSupersetEmbeddedDashboard } from './CreateSupersetEmbeddedDashboard.js'
import styles from './styles/CreateDashboardButton.module.css'

export const CreateDashboardButton = () => {
    const history = useHistory()
    const hasSupersetSupport = useHasSupersetSupport()
    const [isChooseDashboardTypeModalOpen, setIsChooseDashboardTypeModalOpen] =
        useState(false)
    const [isCreateSupersetDashboardOpen, setIsCreateSupersetDashboardOpen] =
        useState(false)
    const navigateToNewInternalDashboardView = useCallback(() => {
        history.push('/new')
    }, [history])
    const handleCreateButtonClick = useCallback(() => {
        if (hasSupersetSupport) {
            setIsChooseDashboardTypeModalOpen(true)
        } else {
            navigateToNewInternalDashboardView()
        }
    }, [hasSupersetSupport, navigateToNewInternalDashboardView])

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
                        setIsCreateSupersetDashboardOpen(true)
                    }}
                    onSelectInternal={() => {
                        setIsChooseDashboardTypeModalOpen(false)
                        navigateToNewInternalDashboardView()
                    }}
                />
            )}
            {isCreateSupersetDashboardOpen && (
                <CreateSupersetEmbeddedDashboard
                    backToChooseDashboardModal={() => {
                        setIsCreateSupersetDashboardOpen(false)
                        setIsChooseDashboardTypeModalOpen(true)
                    }}
                    closeModal={() => {
                        setIsCreateSupersetDashboardOpen(false)
                    }}
                />
            )}
        </>
    )
}
