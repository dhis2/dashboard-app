import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import { useConfig } from '@dhis2/app-runtime'
import ItemHeader from '../ItemHeader/ItemHeader'
import Line from '../../../widgets/Line'
import { useUserSettings } from '../../UserSettingsProvider'

import { sGetMessagesRoot } from '../../../reducers/messages'
import { formatDate } from '../../../modules/util'
import { isViewMode } from '../../Dashboard/dashboardModes'

import classes from './styles/Item.module.css'
import './MessagesItem.css'

const PRIVATE = 'PRIVATE'

const messageTypes = {
    [PRIVATE]: 'Private',
    VALIDATION_RESULT: 'Validation',
    TICKET: 'Ticket',
    SYSTEM: 'System',
}

const MessagesItem = ({ messages, item, dashboardMode }) => {
    const { baseUrl } = useConfig()
    const { userSettings } = useUserSettings()

    const getMessageHref = msg => {
        const msgIdentifier = msg ? `#/${msg.messageType}/${msg.id}` : ''
        return `${baseUrl}/dhis-web-messaging/${msgIdentifier}`
    }

    const getMessageSender = msg => {
        const latestMsg = msg.messages.slice(-1)[0]
        return latestMsg.sender ? latestMsg.sender.displayName : ''
    }

    const getMessageItems = () => {
        const modeClass = isViewMode(dashboardMode) ? 'view' : null

        return messages.map(msg => {
            const redirectToMsg = () => {
                if (isViewMode(dashboardMode)) {
                    document.location.href = getMessageHref(msg)
                }
            }

            const sender =
                msg.messageType === PRIVATE
                    ? getMessageSender(msg)
                    : messageTypes[msg.messageType]

            const readClass = !msg.read ? 'unread' : null
            const latestMsg = msg.messages.slice(-1)[0]
            const msgDate = latestMsg.lastUpdated

            return (
                <li
                    className={`message-item ${modeClass}`}
                    key={msg.id}
                    onClick={redirectToMsg}
                >
                    <p className={`message-title ${readClass}`}>
                        {msg.displayName} ({msg.messageCount})
                    </p>
                    <p className={classes.sender}>
                        {sender} -{' '}
                        {formatDate(msgDate, userSettings.keyUiLocale)}
                    </p>
                    <p className={classes.snippet}>{latestMsg.text}</p>
                </li>
            )
        })
    }

    return (
        <>
            <ItemHeader
                title={i18n.t('Messages')}
                itemId={item.id}
                dashboardMode={dashboardMode}
                isShortened={item.shortened}
            />
            <Line />
            {messages.length > 0 && (
                <div className="dashboard-item-content">
                    <ul className={classes.list}>{getMessageItems()}</ul>
                    <div className={classes.seeAll}>
                        <a href={getMessageHref()}>
                            {i18n.t('See all messages')}
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}

MessagesItem.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    messages: PropTypes.array,
}

const mapStateToProps = state => {
    return {
        messages: Object.values(sGetMessagesRoot(state)),
    }
}

const MessagesContainer = connect(mapStateToProps, null)(MessagesItem)

export default MessagesContainer
