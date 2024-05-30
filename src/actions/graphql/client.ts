'use server'
import { ApolloClient, InMemoryCache, HttpLink, createHttpLink, ApolloLink } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { cookies, headers } from "next/headers";
import { TOKEN_COOKIE_NAME } from "../jwt";


export const createClient = async () => {
    const middleware = new ApolloLink((operation, forward) => {
        const headers = {
            cookie: cookies().get(TOKEN_COOKIE_NAME)?.value ?? "",
            language: 'en',
            clientType: 'BACKEND'
        }

        operation.setContext({
            headers,
        })

        return forward(operation);
    })

    const httpLink = new HttpLink({
        uri: 'http://localhost:4000/graphql',
        credentials: 'include'
    })


    return new ApolloClient({
        link: ApolloLink.from([middleware, httpLink]),
        cache: new InMemoryCache(),
        credentials: 'include',
        ssrMode: true,
    });
}