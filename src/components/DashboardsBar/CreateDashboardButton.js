import { Button, IconAdd16 } from '@dhis2/ui'
import React from 'react'
import { useHistory } from 'react-router-dom'
import styles from './styles/CreateDashboardButton.module.css'

export const CreateDashboardButton = () => {
    const history = useHistory()

    return (
        <Button
            onClick={() => history.push('/new')}
            secondary
            small
            icon={<IconAdd16 />}
            className={styles.createDashboardButton}
            dataTest="new-button"
        />
    )
}
