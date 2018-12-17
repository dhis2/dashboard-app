import reducer, { RECEIVED_MESSAGES } from '../messages';

describe('messages reducer', () => {
    const currentState = {
        msg0: { id: 'msg0', text: 'blabla' },
        msg1: { id: 'msg1', text: 'nafnaf' },
    };

    const matcher = {
        msg0: { id: 'msg0', text: 'blabla' },
        msg1: { id: 'msg1', text: 'nafnaf' },
    };

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' });

        expect(actualState).toEqual({});
    });

    it('should add the received messages', () => {
        const newMessages = [
            { id: 'msg1', text: 'mooo' },
            { id: 'msg2', text: 'grrr' },
            { id: 'msg3', text: 'woot' },
        ];

        const actualState = reducer(currentState, {
            type: RECEIVED_MESSAGES,
            value: newMessages,
        });

        const expected =
            Object.keys(currentState).length + newMessages.length - 1;

        expect(Object.keys(actualState).length).toEqual(expected);

        //check that reducer did not mutate the passed in state
        expect(currentState).toMatchObject(matcher);
    });

    it('should update an existing message', () => {
        const newMessages = [{ id: 'msg1', text: 'mooo' }];

        const actualState = reducer(currentState, {
            type: RECEIVED_MESSAGES,
            value: newMessages,
        });

        expect(actualState.msg1.text).toEqual('mooo');
    });
});
