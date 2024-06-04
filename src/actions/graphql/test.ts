'use server'

import { gql } from "@apollo/client"
import { TOKEN_COOKIE_NAME } from "../jwt"
import { cookies } from "next/headers"
import { createClient } from "./client"
import { GET_USERS } from "./queries"
import { User } from "@/app/context/AuthContext"


export async function get_users() {
    const client = await createClient();
    const {data, error} = await client.query({
        query: GET_USERS,
    })
    if(error) console.log('error', error.message);
    return data.users ?? [];
}

export async function get_user(){
    const client = await createClient();
    const {data, error} = await client.query({
        query: gql`
            query get_user{
                user{
                    id
                    name
                    email
                }
            }
        `,
    });

    if(error){ 
        console.log(error);
        return null;
    }
    
    return data.user as User ?? null;
}