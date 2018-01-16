import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getManifest } from 'd2/lib/d2';
import { getBaseUrl } from '../../config';
import { fromMessages } from '../../reducers';
import { colors } from '../PluginItem/colors';
import { formatDate, sortByDate } from '../../util';

const style = {
    container: {
        overflowY: 'scroll',
    },
    list: {
        listStyleType: 'none',
        paddingLeft: '0px',
    },
    listitem: {
        borderBottom: `1px solid ${colors.lightGrey}`,
        marginBottom: '10px',
        paddingBottom: '10px',
    },
    date: {
        float: 'right',
    },
};

class MessagesItem extends Component {
    state = {
        uiLocale: '',
        baseUrl: '',
    };

    async componentDidMount() {
        const uiLocale = await this.context.d2.currentUser.userSettings.get(
            'keyUiLocale'
        );

        this.setState({ uiLocale });

        const manifest = await getManifest();
        const baseUrl = getBaseUrl(manifest);
        this.setState({ baseUrl });
    }

    linkSrc = id => {
        return `${
            this.state.baseUrl
        }/dhis-web-messaging/readMessage.action?id=${id}`;
    };

    render() {
        const { messages } = this.props;
        const messageItems = sortByDate(messages, 'lastUpdated', false).map(
            msg => {
                return (
                    <li style={style.listitem} key={msg.id}>
                        <div>
                            <div>{msg.userSurname}</div>
                            <a href={this.linkSrc(msg.id)}>
                                <span>
                                    {msg.displayName} ({msg.messageCount})
                                </span>
                            </a>
                        </div>
                        <div style={style.date}>
                            {formatDate(msg.lastUpdated, this.state.uiLocale)}
                        </div>
                    </li>
                );
            }
        );

        const conversationCount = messages.length;

        return (
            <Fragment>
                <div>Messages ({conversationCount})</div>
                <div style={style.container}>
                    <ul style={style.list}>{messageItems}</ul>
                </div>
            </Fragment>
        );
    }
}

MessagesItem.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = state => {
    return {
        messages: Object.values(fromMessages.sGetMessages(state)),
    };
};

const MessagesContainer = connect(mapStateToProps, null)(MessagesItem);

export default MessagesContainer;
