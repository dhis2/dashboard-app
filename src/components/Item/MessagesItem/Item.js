import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { useConfig } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import ItemHeader from '../ItemHeader/ItemHeader'
import Line from '../../../widgets/Line'

import { sGetMessagesRoot } from '../../../reducers/messages'
import { formatDate } from '../../../modules/util'
import { isViewMode } from '../../Dashboard/dashboardModes'

import './MessagesItem.css'

const PRIVATE = 'PRIVATE'

const messageTypes = {
    [PRIVATE]: 'Private',
    VALIDATION_RESULT: 'Validation',
    TICKET: 'Ticket',
    SYSTEM: 'System',
}

const style = {
    list: {
        listStyleType: 'none',
        paddingLeft: '0px',
    },
    seeAll: {
        textAlign: 'center',
        fontSize: '13px',
        marginBottom: '5px',
    },
    sender: {
        fontSize: '13px',
        lineHeight: '15px',
        margin: 0,
        color: colors.grey800,
    },
    snippet: {
        color: colors.grey800,
        fontSize: '13px',
        lineHeight: '15px',
        maxHeight: '30px',
        overflow: 'hidden',
    },
}

const MessagesItem = ({ messages, item, dashboardMode }) => {
    const [uiLocale, setUiLocale] = useState('')
    const { d2 } = useD2({})
    const { baseUrl } = useConfig()

    useEffect(() => {
        const getUiLocale = async () => {
            const uiLocale = await d2.currentUser.userSettings.get(
                'keyUiLocale'
            )
            setUiLocale(uiLocale)
        }
        getUiLocale()
    }, [])

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
                    <p style={style.sender}>
                        {sender} - {formatDate(msgDate, uiLocale)}
                    </p>
                    <p style={style.snippet}>{latestMsg.text}</p>
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
                    <ul style={style.list}>{getMessageItems()}</ul>
                    <div style={style.seeAll}>
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
