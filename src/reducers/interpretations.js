/** @module reducers/interpretations */

import update from 'immutability-helper'

export const actionTypes = {
    ADD_INTERPRETATION: 'ADD_INTERPRETATION',
    ADD_INTERPRETATIONS: 'ADD_INTERPRETATIONS',
    REMOVE_INTERPRETATION: 'REMOVE_INTERPRETATION'
}

// Reducer

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.ADD_INTERPRETATION: {
            return Object.assign({}, state, {
                [action.value.id]: action.value
            })
        }
        case actionTypes.ADD_INTERPRETATIONS: {
            const newInterpretations = action.value.reduce((acc, curr) => {
                return {
                    ...acc,
                    [curr.id]: curr
                }
            }, {})

            return Object.assign({}, state, newInterpretations)
        }
        case actionTypes.REMOVE_INTERPRETATION: {
            return update(state, { $unset: [action.value] })
        }
        default:
            return state
    }
}

// Selectors

export const sGetInterpretation = (state, id) => {
    return state.interpretations[id] || null
}

export const sGetInterpretations = (state, ids) => {
    const interpretations = {}

    ids.forEach(id => {
        if (state.interpretations[id]) {
            interpretations[id] = Object.assign({}, state.interpretations[id])
        }
    })

    return interpretations
}
