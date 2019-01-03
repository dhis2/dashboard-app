import reducer, {
    ADD_INTERPRETATIONS,
    REMOVE_INTERPRETATION,
    RECEIVED_INTERPRETATION,
} from '../interpretations';
import update from 'immutability-helper';

describe('interpretations reducer', () => {
    const currentState = {
        int0: { id: 'int0', text: 'blabla' },
        int1: { id: 'int1', text: 'nafnaf' },
    };

    const matcher = {
        int0: { id: 'int0', text: 'blabla' },
        int1: { id: 'int1', text: 'nafnaf' },
    };

    it('should return the default state', () => {
        const actualState = reducer(undefined, { type: 'NO_MATCH' });

        expect(actualState).toEqual({});
    });

    it('should add an interpretation', () => {
        const newInterpretation = { id: 'int2', text: 'woot' };

        const actualState = reducer(currentState, {
            type: RECEIVED_INTERPRETATION,
            value: newInterpretation,
        });

        const expectedState = Object.assign({}, currentState, {
            [newInterpretation.id]: newInterpretation,
        });

        expect(actualState).toEqual(expectedState);

        //check that reducer did not mutate the passed in state
        expect(currentState).toMatchObject(matcher);
    });

    it('should add a list of interpretations', () => {
        const newInterpretations = [
            { id: 'int2', text: 'grrr' },
            { id: 'int3', text: 'woot' },
        ];

        const actualState = reducer(currentState, {
            type: ADD_INTERPRETATIONS,
            value: newInterpretations,
        });

        const expected =
            Object.keys(currentState).length + newInterpretations.length;
        expect(Object.keys(actualState).length).toEqual(expected);

        //check that reducer did not mutate the passed in state
        expect(currentState).toMatchObject(matcher);
    });

    it('should remove an interpretation', () => {
        const actualState = reducer(currentState, {
            type: REMOVE_INTERPRETATION,
            value: 'int1',
        });

        const expectedState = update(currentState, { $unset: ['int1'] });

        expect(actualState).toEqual(expectedState);

        //check that reducer did not mutate the passed in state
        expect(currentState).toMatchObject(matcher);
    });
    it('should update an edited interpretation', () => {
        const updatedInterpretation = { id: 'int1', text: 'edit, edit' };

        const actualState = reducer(currentState, {
            type: RECEIVED_INTERPRETATION,
            value: updatedInterpretation,
        });

        const expectedState = Object.assign({}, currentState, {
            [updatedInterpretation.id]: updatedInterpretation,
        });

        expect(actualState).toMatchObject(expectedState);
    });
});
