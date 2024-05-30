'use client'

import { find_current_user } from "@/actions/user";
import { createContext, useEffect, useState } from "react"



export type User = {
    id: string,
    name: string,
    email: string,
}

interface contextType{
    user: User | null,
    handleUser: (user : User | null) => void;
    loading: boolean
}

export const AuthContext = createContext<contextType | null>(null);

export function AuthProvider ({
 children
} : {children: React.ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const handleUser = (
        user : User | null
    ) => {
        setUser(user);
    }


    useEffect(() => {
        const fetchUser = async () => {
            const res = await find_current_user();
            console.log(res);
            setUser(res);
            setLoading(false);
        }
        fetchUser();
    }, [])


    return(
        <AuthContext.Provider value={{user, handleUser, loading}}>
            {children}
        </AuthContext.Provider>
    )
}