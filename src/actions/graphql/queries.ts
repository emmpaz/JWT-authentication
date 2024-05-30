import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from "../jwt";


export const GET_USERS = gql`
    query GetUsers {
        users {
            id
            name
            email
        }
    }
`;