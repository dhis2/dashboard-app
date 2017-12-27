import React, { Component } from 'react';

import TextField from 'd2-ui/lib/text-field/TextField';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

const style = {
    list: {
        listStyleType: 'none',
    },
    item: {
        borderBottom: '1px solid #DCDCDC',
        marginBottom: 10,
        paddingBottom: 10,
    },
    author: {
        fontWeight: 'bold',
    },
    created: {
        float: 'right',
    },
    text: {},
    reply: {},
};

class Interpretations extends Component {
    render() {
        const interpretationBody = item => {
            return (
                <div>
                    <div>
                        <span style={style.author}>
                            {item.user.displayName}
                        </span>
                        <span style={style.created}>{item.created}</span>
                    </div>
                    <p style={style.text}>{item.text}</p>
                </div>
            );
        };

        const Items = this.props.interpretations.map(item => {
            const comments = item.comments.map(comment => (
                <li key={comment.id}>{interpretationBody(comment)}</li>
            ));

            return (
                <li style={style.item} key={item.id}>
                    {interpretationBody(item)}
                    <div>
                        <button>
                            <SvgIcon icon="Launch" />
                            View in Visualizer
                        </button>
                        <button style={style.reply}>
                            <SvgIcon icon="Reply" />
                            Reply
                        </button>
                        <button style={style.like}>
                            <SvgIcon icon="ThumbUp" />
                            Like
                        </button>
                        <span>{item.likedBy.length} likes</span>
                    </div>
                    <ul style={style.list}>{comments}</ul>
                    <div>
                        <TextField />
                        <button>POST</button>
                    </div>
                </li>
            );
        });

        return (
            <div>
                <h3 style={style.title}>
                    Interpretations ({this.props.interpretations.length})
                </h3>
                <ul style={style.list}>{Items}</ul>
            </div>
        );
    }
}

export default Interpretations;
