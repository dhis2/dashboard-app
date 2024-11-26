import { OfflineTooltip } from '@dhis2/analytics'
import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, colors, IconMore16, SharingDialog } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { orObject } from '../../../modules/util.js'
import { sGetSelected } from '../../../reducers/selected.js'
import DropdownButton from '../../DropdownButton/DropdownButton.js'
import FilterSelector from './FilterSelector.js'
import MoreOptionsMenu from './MoreOptionsMenu.js'
import classes from './styles/ActionsBar.module.css'

const ActionsBar = ({
    access,
    allowedFilters,
    id,
    restrictFilters,
    showAlert,
    starred,
    toggleDashboardStarred,
}) => {
    const history = useHistory()
    const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false)
    const [sharingDialogIsOpen, setSharingDialogIsOpen] = useState(false)
    const { isDisconnected: offline } = useDhis2ConnectionStatus()
    const onToggleSharingDialog = useCallback(() => {
        setSharingDialogIsOpen((currentOpenState) => !currentOpenState)
    }, [])
    const closeMoreOptionsMenu = useCallback(() => {
        setMoreOptionsIsOpen(false)
    }, [])
    const userAccess = orObject(access)

    return (
        <>
            <div className={classes.actions}>
                {userAccess.update ? (
                    <OfflineTooltip>
                        <Button
                            secondary
                            small
                            disabled={offline}
                            className={classes.editButton}
                            onClick={() => history.push(`${id}/edit`)}
                        >
                            {i18n.t('Edit')}
                        </Button>
                    </OfflineTooltip>
                ) : null}
                {userAccess.manage ? (
                    <OfflineTooltip>
                        <Button
                            secondary
                            small
                            disabled={offline}
                            className={classes.shareButton}
                            onClick={onToggleSharingDialog}
                        >
                            {i18n.t('Share')}
                        </Button>
                    </OfflineTooltip>
                ) : null}
                <FilterSelector
                    allowedFilters={allowedFilters}
                    restrictFilters={restrictFilters}
                />
                <DropdownButton
                    className={classes.more}
                    secondary
                    small
                    open={moreOptionsIsOpen}
                    disabledWhenOffline={false}
                    onClick={() => setMoreOptionsIsOpen(!moreOptionsIsOpen)}
                    icon={<IconMore16 color={colors.grey700} />}
                    component={
                        <MoreOptionsMenu
                            close={closeMoreOptionsMenu}
                            showAlert={showAlert}
                            toggleDashboardStarred={toggleDashboardStarred}
                            starred={starred}
                        />
                    }
                >
                    <wbr />
                </DropdownButton>
            </div>
            {id && sharingDialogIsOpen && (
                <SharingDialog
                    id={id}
                    type="dashboard"
                    onClose={onToggleSharingDialog}
                />
            )}
        </>
    )
}

ActionsBar.propTypes = {
    access: PropTypes.object,
    allowedFilters: PropTypes.array,
    id: PropTypes.string,
    restrictFilters: PropTypes.bool,
    showAlert: PropTypes.func,
    starred: PropTypes.bool,
    toggleDashboardStarred: PropTypes.func,
}

const mapStateToProps = (state) => {
    const dashboard = sGetSelected(state)

    return {
        access: dashboard.access,
        allowedFilters: dashboard.allowedFilters,
        id: dashboard.id,
        restrictFilters: dashboard.restrictFilters,
    }
}

export default connect(mapStateToProps)(ActionsBar)
