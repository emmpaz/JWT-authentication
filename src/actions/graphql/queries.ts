'use server'
import { gql } from "@apollo/client";
import { getClient } from "./client";
import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from "../jwt";


export const GET_USERS = gql`
    query GetUsers{
        users{
            id
            name
            email
        }
    }
`

export async function users(){
    const client = getClient();
    
    const token = await cookies().get(TOKEN_COOKIE_NAME)?.value;

    const jwtToken = JSON.parse(token ?? "");

    const {data} = await client.query({
        query: GET_USERS,
        context: {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
    })

    console.log(data);

    return {
        data: data.users}
}