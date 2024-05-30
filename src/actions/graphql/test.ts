'use server'

import { gql } from "@apollo/client"
import { TOKEN_COOKIE_NAME } from "../jwt"
import { cookies } from "next/headers"
import { createClient } from "./client"
import { GET_USERS } from "./queries"


export async function get_users() {
    const client = await createClient();
    const {data, error} = await client.query({
        query: GET_USERS,
    })
    if(error) console.log(error)
    console.log('test')
    return data.users;
}