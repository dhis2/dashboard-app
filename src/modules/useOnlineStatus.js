// import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { acSetIsOnline } from '../actions/isOnline'

export const useOnlineStatus = () => {
    const isOnline = useSelector(state => state.isOnline)
    const dispatch = useDispatch()
    return {
        isOnline,
        toggleIsOnline: () => dispatch(acSetIsOnline()),
    }
}
