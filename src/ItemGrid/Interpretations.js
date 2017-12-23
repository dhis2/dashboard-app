import React, { Component } from 'react';

import TextField from 'd2-ui/lib/text-field/TextField';

/*
http://localhost:8080/api/interpretations.json?
fields=id,user[firstName,surname],text,created,likes,
comments[id,created,text,user[id,firstName,surname]]
*/
const listItems = [
    {
        id: 'xyzpdq',
        author: 'Tim Wakiki',
        created: '2017-10-01',
        likes: 2,
        text:
            'The number of malaria cases exceeded the threshold for area Badjia and time period 201701. Please investigate the situation.',
        comments: [],
    },
    {
        id: 'abc123',
        author: 'Amanda Alison',
        created: '2017-10-10',
        likes: 0,
        text:
            'Text here. This is a separate interpretation from the one above. This is the content for the interpretation, which can be long. We can include a View More link to help with blablab bla',
        comments: [
            {
                id: 'lmfao',
                created: '2017-10-10',
                author: 'Charlotte Akselsen',
                text:
                    'This is a reply. This is the text for a reply. It is not possible to reply to a reply, nor is it possible to like a reply',
            },
        ],
    },
];

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
        const Items = listItems.map(item => {
            const comments = item.comments.map(comment => {
                return (
                    <li key={comment.id}>
                        <div>
                            <span style={style.author}>{comment.author}</span>
                            <span style={style.created}>{comment.created}</span>
                        </div>
                        <p style={style.text}>{comment.text}</p>
                    </li>
                );
            });

            return (
                <li style={style.item} key={item.id}>
                    <div>
                        <span style={style.author}>{item.author}</span>
                        <span style={style.created}>{item.created}</span>
                    </div>
                    <p style={style.text}>{item.text}</p>
                    <div>
                        <a href="#">View in Visualizer</a>
                        <button style={style.reply}>Reply</button>
                        <button style={style.like}>Like</button>
                        <span>{item.likes} likes</span>
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
                    Interpretations ({listItems.length})
                </h3>
                <ul style={style.list}>{Items}</ul>
            </div>
        );
    }
}

export default Interpretations;
