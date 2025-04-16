import React, { createContext, useState, useEffect } from 'react'

export const UserDataContext = createContext()

const UserContext = ({ children }) => {
    const [user, setUser] = useState({
        id: '',
        email: '',
        roleId: '',
        userType: '',
        fullName: {
            firstName: '',
            lastName: ''
        },
        profileUrl: '',
    })
    const [isLoading, setIsLoading] = useState(true)

    // Load initial data from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('userData')
        const companyId = localStorage.getItem('companyId')
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            // Transform data to match dashboard structure
            setUser({
                ...parsedUser,
                companyId,
                fullName: {
                    firstName: parsedUser.fullName.firstName,
                    lastName: parsedUser.fullName.lastName
                }
            })
        }
        setIsLoading(false)
    }, [])

    // Custom setter that updates both state and localStorage
    const updateUser = (userData) => {
        setUser(userData)
        localStorage.setItem('userData', JSON.stringify(userData))
    }

    if (isLoading) {
        return null
    }

    return (
        <UserDataContext.Provider value={{ user, setUser: updateUser }}>
            {children}
        </UserDataContext.Provider>
    )
}

export default UserContext