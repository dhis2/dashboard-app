import React, { useContext, useState, useEffect, createContext } from 'react'
import PropTypes from 'prop-types'

const SystemSettingsContext = createContext()

const query = {
    myData: {
        resource: 'systemSettings',
    },
}

const SystemSettingsProvider = ({ engine, children }) => {
    const [settings, setSettings] = useState([])

    useEffect(() => {
        async function fetchData() {
            // use the await keyword to grab the resolved promise value
            const { myData } = await engine.query(query)

            setSettings(myData)
        }
        fetchData()
    }, [])

    return (
        <SystemSettingsContext.Provider
            // Add required values to the value prop within an object (my preference)
            value={{
                settings,
            }}
        >
            {children}
        </SystemSettingsContext.Provider>
    )
}

SystemSettingsProvider.propTypes = {
    children: PropTypes.node,
    engine: PropTypes.object,
}

export default SystemSettingsProvider

// Create a hook to use the SystemSettingsContext, this is a Kent C. Dodds pattern
export const useSystemSettings = () => {
    const context = useContext(SystemSettingsContext)
    if (context === undefined) {
        throw new Error('Context must be used within a Provider')
    }
    return context
}
